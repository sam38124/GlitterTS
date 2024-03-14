export declare function createEC2Instance(): Promise<string | undefined>;
export declare function terminateInstances(instanceId: string): Promise<boolean>;
export declare function getEC2INFO(instanceId: string): Promise<unknown>;
