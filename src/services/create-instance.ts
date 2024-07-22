import AWS from 'aws-sdk';
import config from '../config.js';
import process from 'process';

// 配置AWS SDK
AWS.config.update({
    region: 'ap-east-1', // 替換為您的AWS區域，例如'us-east-1
});

// 建立EC2實例
export async function createEC2Instance() {
    // 配置AWS SDK
    AWS.config.update({
        region: 'ap-east-1', // 替換為您的AWS區域，例如'us-east-1
    });
    const ec2 = new AWS.EC2();

    const params = {
        ImageId: process.env.AUTO_SCALING_IMAGE, // 替換為您的AMI ID
        InstanceType: 't3.micro', // 替換為您的實例類型
        MinCount: 1,
        MaxCount: 1,
        KeyName: process.env.AWS_KEY, // 替换为你的 Key Pair 名称
        SecurityGroupIds: [process.env.SECURITY_ID as any], // 替换为你的安全组 ID
    };
    try {
        const data = await ec2.runInstances(params).promise();
        const instanceId = data.Instances![0].InstanceId;
        console.log('EC2 instance created with ID:', instanceId);
        return instanceId;
    } catch (error) {
        console.error('Error creating EC2 instance:', error);
    }
}

// 終止EC2實例
export async function terminateInstances(instanceId: string) {
    const ec2 = new AWS.EC2();
    const params = {
        InstanceIds: [instanceId],
    };
    try {
        const data = await ec2.terminateInstances(params).promise();
        console.log('EC2 instance terminated:', data);
        return true;
    } catch (error) {
        console.error('Error terminating EC2 instance:', error);
        return false;
    }
}

//取得EC2實例的IP
export function getEC2INFO(instanceId: string) {
    const ec2 = new AWS.EC2();
    const params = {
        InstanceIds: [instanceId],
    };
    return new Promise((resolve, reject) => {
        // 调用 describeInstances 方法获取实例信息
        ec2.describeInstances(params, (err, data) => {
            if (err) {
                console.error('Error describing EC2 instances:', err);
                resolve(false);
            } else {
                // 提取 IP 地址
                resolve({
                    ipAddress: data.Reservations![0]!.Instances![0]!.PublicIpAddress,
                    type: data.Reservations![0]!.Instances![0]!.InstanceType,
                });
            }
        });
    });
}
