import { FastifyInstance } from 'fastify';
import { BatchRepository } from '../../repositories/BatchRepository';
import { batchStatusEnum } from '../../types/batchStatus';
import { authWSHandler } from '../../hooks/authHandler';

type Lance = {
    batchId: string;
    userName: string;
    userId: string;
    value: number;
    code: number;
    index: number;
}

const bidsByBatchId: Record<string, Lance[]> = {};
const batchState: Record<string, { isOpen: boolean }> = {};
const waitForConfirmation: Record<string, { isConfirmed: boolean }> = {};
const lastValue: Record<string, number> = { '': 0 };

async function checkAndOpenBatchs() {
    console.log('Verificando lotes para abrir...');
    const batchRepository = new BatchRepository();
    const batchesWithRegistration = await batchRepository.getBatchesWithRegistration();

    batchesWithRegistration.map(async (batchInfo: any) => {
        const { id, startDateTime } = batchInfo;

        if (!batchState[id]) {
            batchState[id] = { isOpen: false };
        }

        if (!waitForConfirmation[id]) {
            waitForConfirmation[id] = { isConfirmed: false };
        }

        const currentDateTime = new Date();
        currentDateTime.setHours(currentDateTime.getHours() - 3);
        console.log('Hora atual:', currentDateTime);

        const openingTimeOrignal = new Date(startDateTime);
        console.log('Hora de abertura:', openingTimeOrignal);
        const openingTime = new Date(openingTimeOrignal.getTime() - 600000);
        console.log('Hora de abertura - 10 minutos:', openingTime);

        if (currentDateTime >= openingTime && currentDateTime < openingTimeOrignal) {
            if (!waitForConfirmation[id].isConfirmed) {                
                waitForConfirmation[id].isConfirmed = true;
                await batchRepository.changeStatus(id, batchStatusEnum.WAITING_FOR_PARTICIPANTS);
            }
        } else if (currentDateTime >= openingTimeOrignal) {
            waitForConfirmation[id].isConfirmed = false;

            const hasParticipantsConfirmed = await batchRepository.hasParticipants(id);

            if (!hasParticipantsConfirmed) {
                batchState[id].isOpen = false;

                await batchRepository.changeStatus(id, batchStatusEnum.CLOSED);
            } else {
                await batchRepository.changeStatus(id, batchStatusEnum.IN_PROGRESS);
    
                batchState[id].isOpen = true;
    
                const openingTimeToBids = new Date(openingTimeOrignal.getTime() + 600000);
    
                if (currentDateTime >= openingTimeToBids) {
                    batchState[id].isOpen = false;
    
                    await batchRepository.changeStatus(id, batchStatusEnum.CLOSED);
                }
            }

        } else {
            waitForConfirmation[id].isConfirmed = false;
            batchState[id].isOpen = false;
        }

        console.log('Lote verificado:', id);
    });
    
    console.log('Verificação de lotes concluída.');
}


export async function bids(app: FastifyInstance) {
    await checkAndOpenBatchs();

    setInterval(async () => {
        await checkAndOpenBatchs();
    }, 60000);

    app.get('/:batchId/bids', { websocket: true }, async (socket, request) => {
        const { batchId } = request.params as any;

        const batchRepository = new BatchRepository();
        const batch = await batchRepository.getBatchById(batchId);
        const initialValue = batch?.price || 0;

        // Associar conexão WebSocket ao lote específico
        socket.batchId = batchId;

        // Verificar se o lote está aberto para lances
        if (batchState[batchId] && batchState[batchId].isOpen) {
        // if (true) {
            // Enviar lances anteriores para o cliente
            if (bidsByBatchId[batchId]) {
                bidsByBatchId[batchId].forEach((lance: Lance) => {
                    socket.send(JSON.stringify({ type: 'bid', ...lance }));
                });
            }
            
            // Avise a todos os cleintes conectados que o tempo restante para dar lances está finalizando, quando faltar 1 minuto
            // const currentDateTime = new Date();
            // currentDateTime.setHours(currentDateTime.getHours() - 3);
            // const openingTimeOrignal = new Date(batch?.startDateTime || ''); // Início do lote
            // const timeToBids = new Date(openingTimeOrignal.getTime() + 600000); // 10 minutos após o início do lote

            // // diferença entre currentDateTime e timeToBids quando faltar 1 minuto
            // const difference = timeToBids.getTime() - currentDateTime.getTime();

            // if (difference <= 60000 && difference > 0) {
            //     app.websocketServer.clients.forEach((client: any) => {
            //         if (client.batchId === batchId && client.readyState === 1) {
            //             client.send(JSON.stringify({ type: 'info', message: 'Faltam 1 minuto para o fim dos lances' }));
            //         }
            //     });
            // }

            socket.on('message', async (message: string) => {
                if (batchState[batchId] && !batchState[batchId].isOpen) {
                    socket.send(JSON.stringify({ type: 'error', message: 'Lote fechado para lances' }));
                    return;
                }
                
                try {
                    const data = JSON.parse(message);

                    // Checar se é uma mensagem de autenticação
                    if (data.type === 'authentication') {
                        const userData = authWSHandler(data.token || '', (error: any) => {
                            if (error) {
                                socket.send(JSON.stringify({ type: 'error', message: error.message }));
                                socket.close();
                            }
                        });

                        if (!userData) {
                            socket.send(JSON.stringify({ type: 'error', message: 'Autenticação falha' }));
                            socket.close();
                            return;
                        }
                        socket.user = userData;
                    }

                    // Continuar com a lógica de lances
                    if (data.type === 'bid') {
                        // Certifique-se de que a conexão está autenticada
                        if (!socket.user) {
                            socket.send(JSON.stringify({ type: 'error', message: 'Usuário não autenticado' }));
                            return;
                        }
                        // Lógica de processamento de lance aqui...
                        if (lastValue[batchId] == 0) {
                            lastValue[batchId] = initialValue;
                        }
    
                        if (data.value <= lastValue[batchId]) {
                            socket.send(JSON.stringify({ type: 'error', message: 'Lance inválido! Informe um valor superior ao último lance' }));
                            return;
                        }
    
                        lastValue[batchId] = data.value;
    
                        // Processar o lance recebido
                        const lance: Lance = {
                            batchId: batchId,
                            userName: socket.user.name,
                            userId: socket.user.id,
                            value: lastValue[batchId],
                            code: batch?.code || 0,
                            index: bidsByBatchId[batchId] ? bidsByBatchId[batchId].length : 0
                        }
    
                        // Adicionar o lance à lista de lances para este lote
                        if (!bidsByBatchId[batchId]) {
                            bidsByBatchId[batchId] = [];
                        }
    
                        bidsByBatchId[batchId].push(lance);
    
                        // Enviar o lance para todos os clientes conectados interessados neste lote
                        app.websocketServer.clients.forEach((client: any) => {
                            if (client.batchId === batchId && client.readyState === 1) {
                                const lanceSend = {
                                    type: 'bid',
                                    ...lance
                                }

                                client.send(JSON.stringify(lanceSend));
                            }
                        });
                    }
                    
                } catch (error) {
                    console.error('Erro ao processar mensagem WebSocket:', error);
                }
            });
        } else {
            // Informar ao cliente que o lote está fechado para lances
            socket.send(JSON.stringify({ type: 'error', message: 'Lote fechado para lances' }));
        }

        socket.on('close', () => {
            const currentDateTime = new Date();
            currentDateTime.setHours(currentDateTime.getHours() - 3);
            const openingTimeOrignal = new Date(batch?.startDateTime || ''); // Início do lote
            const timeToBids = new Date(openingTimeOrignal.getTime() + 600000); // 10 minutos após o início do lote

            // Quando o tempo para dar lances acabar, avisar a todos os clientes conectados o vencedor do lote
            if (currentDateTime >= timeToBids) {
                batchState[batchId].isOpen = false;

                const winner = bidsByBatchId[batchId].reduce((prev: any, current: any) => (prev.value > current.value) ? prev : current);

                app.websocketServer.clients.forEach((client: any) => {
                    if (client.batchId === batchId && client.readyState === 1) {
                        client.send(JSON.stringify({ type: 'info', message: `Lote fechado! Vencedor: ${winner.userName} - R$ ${winner.value.toFixed(2)}` }));
                    }
                });

                // // Salvar o vencedor no banco de dados
                // await batchRepository.saveWinner(batchId, winner.userId, winner.value);
            }
            // Remover a conexão WebSocket quando desconectada
            delete socket.batchId;
        });
    });
}