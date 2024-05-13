declare const config: {
    google: {
        maps: {
            apiKey: any;
        };
        identity: {
            oAuth2: {
                clientID: any;
            };
        };
        cloud: {
            project: {
                id: any;
            };
        };
    };
    logLevel: any;
    pg: {
        database: any;
        host: any;
        password: any;
        port: any;
        username: any;
    };
    port: any;
    service: {
        name: any;
        version: any;
    };
};
export { config };
