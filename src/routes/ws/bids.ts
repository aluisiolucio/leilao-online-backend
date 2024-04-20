import { FastifyInstance } from 'fastify';
import { BatchRepository } from '../../repositories/BatchRepository';
import { batchStatusEnum } from '../../types/batchStatus';
import { authWSHandler } from '../../hooks/authHandler';

type Lance = {
    batchId: string;
    user: string;
    value: number;
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

        const openingTimeOrignal = new Date(startDateTime);
        const openingTime = new Date(openingTimeOrignal.getTime() - 600000);

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
    }, 60000); // 1 minuto

    app.get('/:batchId/bids', { websocket: true }, async (socket, request) => {
        // authWSHandler(socket, (error: any) => {
        //     if (error) {
        //         socket.send(JSON.stringify({ message: error.message }));
        //         socket.close();
        //     }
        // });

        const { batchId } = request.params as any;

        const batchRepository = new BatchRepository();
        const batch = await batchRepository.getBatchById(batchId);
        const initialValue = batch?.price || 0;

        // Associar conexão WebSocket ao lote específico
        socket.batchId = batchId;

        // Verificar se o lote está aberto para lances
        if (batchState[batchId] && batchState[batchId].isOpen) {
        // if (true) {
            // Envie lances existentes para o cliente recém-conectado
            if (bidsByBatchId[batchId]) {
                socket.send(JSON.stringify({ data: bidsByBatchId[batchId] }));
            }

            socket.on('message', async (message: string) => {
                if (batchState[batchId] && !batchState[batchId].isOpen) {
                    socket.send(JSON.stringify({ message: 'Lote fechado para lances' }));
                    return;
                }
                
                try {
                    const data = JSON.parse(message);
                    
                    if (lastValue[batchId] == 0) {
                        lastValue[batchId] = initialValue;
                    }

                    if (data.value <= lastValue[batchId]) {
                        socket.send(JSON.stringify({ message: 'Lance inválido! Informe um valor superior ao último lance' }));
                        return;
                    }

                    lastValue[batchId] = data.value;

                    // Processar o lance recebido
                    const lance: Lance = {
                        batchId: batchId,
                        // user: socket.user.name,
                        user: 'Usuário',
                        value: lastValue[batchId],
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
                            client.send(JSON.stringify(lance));
                        }
                    });
                } catch (error) {
                    console.error('Erro ao processar mensagem WebSocket:', error);
                }
            });
        } else {
            // Informar ao cliente que o lote está fechado para lances
            socket.send(JSON.stringify({ message: 'Lote fechado para lances' }));
        }

        socket.on('close', () => {
            // Remover a conexão WebSocket quando desconectada
            delete socket.batchId;
        });
    });
}