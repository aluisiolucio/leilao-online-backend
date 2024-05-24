import { IBatchRepository } from "../repositories/ports/BatchRepositoryInterface";
import { batchStatusEnum } from "../types/batchStatus";
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const S3_BUCKET = process.env.AWS_S3_BUCKET!;
const REGION = process.env.AWS_REGION!;
const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID!;
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY!;

const s3 = new S3Client({
  region: REGION,
  credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY
  }
});


export async function verifyBatch(batch: any, batchRepository: IBatchRepository) {
    const currentDateTime = new Date();
    currentDateTime.setHours(currentDateTime.getHours() - 3);
  
    const openingTimeOrignal = new Date(batch.startDateTime);
    openingTimeOrignal.setHours(openingTimeOrignal.getHours() - 3);
  
    if (currentDateTime > openingTimeOrignal && batch.status !== 'Fechado') {
      const hasParticipantsConfirmed = await batchRepository.hasParticipants(batch.id);
  
      if (!hasParticipantsConfirmed) {
        await batchRepository.changeStatus(batch.id, batchStatusEnum.CLOSED);
      }
    }
}

export async function getSignedUploadUrl(key: string) {
  const signedUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        ContentType: 'image/jpg'
    }),
    // Expires in 5 minutes
    { expiresIn: 300 }
  );

  return signedUrl
}

export async function getSignedDownloadUrl(key: string) {
  const signedUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: key
    }),
    // Expires in 2 minutes
    { expiresIn: 120 }
  );

  return signedUrl
}