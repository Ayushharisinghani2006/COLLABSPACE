const AWS = require('aws-sdk');
const { s3 } = require('../config/aws');

const transcribe = new AWS.TranscribeService();

const speechToText = async (audioFile, meetingId) => {
  const params = {
    TranscriptionJobName: `transcribe-${meetingId}-${Date.now()}`,
    LanguageCode: 'en-US',
    Media: {
      MediaFileUri: audioFile, // S3 URL of the audio file
    },
    OutputBucketName: process.env.AWS_S3_BUCKET,
  };

  try {
    const data = await transcribe.startTranscriptionJob(params).promise();
    return { jobName: params.TranscriptionJobName, status: 'STARTED' };
  } catch (error) {
    throw new Error(`Transcription failed: ${error.message}`);
  }
};

module.exports = { speechToText };