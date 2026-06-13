import type {
        IAuthenticateGeneric,
        Icon,
        ICredentialType,
        INodeProperties,
} from 'n8n-workflow';

export class CowProtocolApi implements ICredentialType {
        name = 'N8nDevCowProtocolApi';

        displayName = 'Cow Protocol API';

        icon: Icon = { light: 'file:../nodes/CowProtocol/cow-protocol.png', dark: 'file:../nodes/CowProtocol/cow-protocol.dark.png' };

        documentationUrl = '';

        properties: INodeProperties[] = [
          {
                        displayName: 'Base URL',
                        name: 'url',
                        type: 'string',
                        default: 'https://api.cow.fi/mainnet',
                        required: true,
                        placeholder: 'https://api.cow.fi/mainnet',
                        description: 'The base URL of your Cow Protocol API server',
                },
                {
                        displayName: 'API Key',
                        name: 'apiKey',
                        type: 'string',
                        typeOptions: { password: true },
                        default: '',
                        required: false,
                },
        
        ];

  authenticate: IAuthenticateGeneric = {
                type: 'generic',
                properties: {
                        headers: {
                                Authorization: '=Bearer {{$credentials.apiKey}}',
                        },
                },
        };


}
