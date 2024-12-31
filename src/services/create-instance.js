"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEC2Instance = createEC2Instance;
exports.terminateInstances = terminateInstances;
exports.getEC2INFO = getEC2INFO;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const process_1 = __importDefault(require("process"));
aws_sdk_1.default.config.update({
    region: 'ap-east-1',
});
async function createEC2Instance() {
    aws_sdk_1.default.config.update({
        region: 'ap-east-1',
    });
    const ec2 = new aws_sdk_1.default.EC2();
    const params = {
        ImageId: process_1.default.env.AUTO_SCALING_IMAGE,
        InstanceType: 't3.micro',
        MinCount: 1,
        MaxCount: 1,
        KeyName: process_1.default.env.AWS_KEY,
        SecurityGroupIds: [process_1.default.env.SECURITY_ID],
    };
    try {
        const data = await ec2.runInstances(params).promise();
        const instanceId = data.Instances[0].InstanceId;
        console.log('EC2 instance created with ID:', instanceId);
        return instanceId;
    }
    catch (error) {
        console.error('Error creating EC2 instance:', error);
    }
}
async function terminateInstances(instanceId) {
    const ec2 = new aws_sdk_1.default.EC2();
    const params = {
        InstanceIds: [instanceId],
    };
    try {
        const data = await ec2.terminateInstances(params).promise();
        console.log('EC2 instance terminated:', data);
        return true;
    }
    catch (error) {
        console.error('Error terminating EC2 instance:', error);
        return false;
    }
}
function getEC2INFO(instanceId) {
    const ec2 = new aws_sdk_1.default.EC2();
    const params = {
        InstanceIds: [instanceId],
    };
    return new Promise((resolve, reject) => {
        ec2.describeInstances(params, (err, data) => {
            if (err) {
                console.error('Error describing EC2 instances:', err);
                resolve(false);
            }
            else {
                resolve({
                    ipAddress: data.Reservations[0].Instances[0].PublicIpAddress,
                    type: data.Reservations[0].Instances[0].InstanceType,
                });
            }
        });
    });
}
//# sourceMappingURL=create-instance.js.map