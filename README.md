# Health Pic

Get a green or red pic depending on the responsiveness of a certain service

## Usage

### Example `config.json`

    {
      facebook: {
        httpRequest: {
          protocol: 'http:',
          hostname: 'www.facebook.com',
          port: 80,
          path: '/',
          method: 'GET'
        }
      }
    }

Get health pic via `http://example.com/facebook`
