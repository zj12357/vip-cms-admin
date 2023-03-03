import { useCallback, useMemo } from 'react';
const { connect: nats_connect, StringCodec } = require('nats.ws/cjs/nats');
const { encode, decode } = StringCodec();
interface Props {
    servers?: Array<string> | string;
}

const useNats = (params?: Props) => {
    const servers = useMemo(() => params?.servers ?? [], [params?.servers]);

    const connect = useCallback(async (servers) => {
        try {
            const nc = await nats_connect({
                servers,
                reconnect: true,
                // pingInterval: 100000,
                // reconnectTimeWait: 100000,
                // timeout: 20000,
                // user: '',
                // pass: '',
                // user: 'admin',
                // password: 'T0pS3cr3t',
            });
            console.log(`connected to ${nc.getServer()}`);
            // this promise indicates the client closed
            // const done = nc.closed();
            // do something with the connection

            // close the connection
            // await nc.close();
            // check if the close was OK
            // const err = await done;
            // if (err) {
            //     console.log(`error closing:`, err);
            // }
            return nc;
        } catch (err) {
            console.log(`error connecting to ${JSON.stringify(err)}`);
        }
    }, []);

    return { connect, decode, encode };
};

export default useNats;
