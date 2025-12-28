/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const lambdaHandler = async (event, context) => {
  let requestPayload = JSON.parse(event.body);
  delete requestPayload.productName;
  requestPayload.productCode = "PSS";
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: requestPayload,
    }),
  };

  console.log("preparing payload");

  const params = {
    Bucket: "policy-cancellation-payloads",
    Key: `payloads/${Date.now()}.json`,
    Body: JSON.stringify({ name: "praveen" }),
    ContentType: "application/json",
  };
  console.log("writing payload to S3");
  await s3.send(new PutObjectCommand(params));
  console.log("Done writing payload to S3");

  return response;
};
