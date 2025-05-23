export declare function sendmail(sender: any, recipient: any, subject: any, body: any, callback?: (result: boolean) => void): Promise<void>;
export declare function verifyDomain(domain: string): Promise<void>;
export declare function verifyStatus(domain: string): Promise<import("@aws-sdk/client-ses").GetIdentityVerificationAttributesCommandOutput>;
