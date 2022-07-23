import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io';
import http from 'http';
import * as socket from '../sockets/sockets'

export default class Server
{
    private static _instance: Server;
    public app: express.Application;
    public port: number;

    public io: socketIO.Server;
    private httpServer: http.Server;

    private constructor(){
        this.app = express();
        this.port = SERVER_PORT;
        this.httpServer = new http.Server( this.app );
        this.io = new socketIO.Server( this.httpServer,
            {
                cors:{origin:true, credentials:true}
            } );
        // this.io = new socketIO.Server( this.httpServer );

        this.escucharSockets();
    }

    public static get instance (){
        return this._instance || ( this._instance = new this() );
    }

    private escucharSockets(){
        this.io.on('connection', (cliente)=>{

            console.log( cliente.id );

            //Conectar Cliente
            socket.conectarCliente( cliente ); 
            //Mensaje
            socket.mensaje(cliente, this.io);
            //Para que se deconecte 
            socket.desconectar(cliente);

            //Configurar Usuario
            socket.configurarUsuario(cliente, this.io);
        });

    }

    start(callback: Function){
        this.httpServer.listen(this.port, callback());
    }

}
