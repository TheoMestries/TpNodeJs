'use strict';

module.exports = {
    scheme: 'jwt',
    options: {
        keys: 'random_string',
        verify: {
            aud: 'urn:audience:iut',
            iss: 'urn:issuer:iut',
            sub: false,
            nbf: true,
            exp: true,
            maxAgeSec: 14400,
            timeSkewSec: 15
        },
        validate: async (artifacts, request, h) => {
            return {
                isValid: true,
                credentials: {
                    scope: artifacts.decoded.payload.role,
                    id: artifacts.decoded.payload.id}
            };
        }

    }
};
