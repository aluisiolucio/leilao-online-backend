import { FastifyInstance, FastifyRequest } from 'fastify';
import { BatchRepository } from '../../repositories/BatchRepository';
import { batchStatusEnum } from '../../types/batchStatus';

type Lance = {
    batchId: string;
    userName: string;
    userId: string;
    value: number;
    code: number;
    index: number;
    time: string;
}

interface CustomRequest extends FastifyRequest {
    user: {
        id: string,
        name: string
    }
}

const bidsByBatchId: Record<string, Lance[]> = {};
const batchState: Record<string, { isOpen: boolean }> = {};
const waitForConfirmation: Record<string, { isConfirmed: boolean }> = {};
const lastValue: Record<string, number> = { '': 0 };

async function checkAndOpenBatchs(app: FastifyInstance) {
    console.log('[HTTP] - Verificando lotes para abrir...');
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
        openingTimeOrignal.setHours(openingTimeOrignal.getHours() - 3);

        const openingTime = new Date(openingTimeOrignal.getTime() - 600000);

        // Período de 10 minutos antes do início do lote, para confirmação de participantes
        if (currentDateTime >= openingTime && currentDateTime < openingTimeOrignal) {
            if (!waitForConfirmation[id].isConfirmed) {                
                waitForConfirmation[id].isConfirmed = true;
                await batchRepository.changeStatus(id, batchStatusEnum.WAITING_FOR_PARTICIPANTS);
            }
        } else if (currentDateTime >= openingTimeOrignal) { // Período de lances
            waitForConfirmation[id].isConfirmed = false;

            const hasParticipantsConfirmed = await batchRepository.hasParticipants(id);

            if (!hasParticipantsConfirmed) {
                batchState[id].isOpen = false;

                await batchRepository.changeStatus(id, batchStatusEnum.CLOSED);
            } else {
                await batchRepository.changeStatus(id, batchStatusEnum.IN_PROGRESS);
    
                batchState[id].isOpen = true;
    
                const timeToBids = new Date(openingTimeOrignal.getTime() + 600000); // 10 minutos após o início do lote, para lances
          
                if (currentDateTime >= timeToBids) {
                    batchState[id].isOpen = false;
    
                    await batchRepository.changeStatus(id, batchStatusEnum.CLOSED);

                    if (!bidsByBatchId[id]) {
                        return;
                    }
                    
                    const winner = bidsByBatchId[id].reduce((prev: any, current: any) => (prev.value > current.value) ? prev : current);

                    // Salvar o vencedor no banco de dados
                    await batchRepository.saveWinner(id, winner.userId, winner.value);
                }
            }

        } else {
            waitForConfirmation[id].isConfirmed = false;
            batchState[id].isOpen = false;
        }

        console.log('[HTTP] - Lote verificado:', id);
    });
    
    console.log('[HTTP] - Verificação de lotes concluída.');
}

export async function lancesHttp(app: FastifyInstance) {
    await checkAndOpenBatchs(app);

    setInterval(async () => {
        await checkAndOpenBatchs(app);
    }, 60000);

    app.get('/:batchId/get-lances', async (request, reply) => {
        const { batchId } = request.params as any;

        if (!bidsByBatchId[batchId] || !batchState[batchId] || !batchState[batchId].isOpen) {
            return [];
        }

        return bidsByBatchId[batchId];
    });

    app.post('/save-lance', async (request, reply) => {
        const { batchId, value } = request.body as any;

        const batchRepository = new BatchRepository();
        const batch = await batchRepository.getBatchById(batchId);
        const initialValue = batch?.price || 0;

        if (lastValue[batchId] == 0 || !lastValue[batchId] || lastValue[batchId] == undefined || lastValue[batchId] == null) {
            lastValue[batchId] = initialValue;
        }

        if (!bidsByBatchId[batchId]) {
            bidsByBatchId[batchId] = [];
        }

        if (batchState[batchId] && batchState[batchId].isOpen) {
            if (value >= lastValue[batchId]) {
                lastValue[batchId] = value;

                const lance: Lance = {
                    batchId: batchId,
                    userName: (request as CustomRequest).user.name,
                    userId: (request as CustomRequest).user.id,
                    value: lastValue[batchId],
                    code: Math.floor(Math.random() * 10000),
                    index: bidsByBatchId[batchId] ? bidsByBatchId[batchId].length : 0,
                    time: new Date().toLocaleTimeString()
                }

                bidsByBatchId[batchId].push(lance);

                return { message: 'Lance realizado com sucesso!' };
            } else {
                return { message: 'Lance não realizado. Valor menor que o último lance.' };
            }
        }

        return { message: 'Lote fechado para lances.' };
    });
}