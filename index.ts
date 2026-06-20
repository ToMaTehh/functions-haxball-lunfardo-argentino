/*
		# ToMaTehhh/functions-haxball-lunfardo-argentino
		
		# DESCRIPCIÓN:
        # Librería de funciones en JavaScript para desarrollar scripts de Haxball utilizando la jerga del lunfardo argentino.
		
		# PROGRAMACIÓN:
		# by ToMaTeh aka mecánico

*/

// @ts-check
const { HBInit } = require('haxball.js');


// - CONFIGURACIÓN GLOBAL DEL SERVIDOR
var NombreDelServidor =					""; 			                       			// Nombre del servidor.
var MaximaCantidadDeJugadores = 		10; 											// Cantidad de jugadores máx.
var ServidorToken =             		""; 		                                    // Token del servidor.
										
var SalaPublica =               		true; 											// true = pública, false = privada
var ContraseñaDeLaSala = 				"123";								 			// Si SalaPublica = false, la contraseña es ContraseñaDeLaSala

var LocalizacionDelServidor =   		"AR"; 											// AR = Argentina
var Latitud	=							-38.872;									    
var Longitud = 							-58.3819;

var NoQuieroUnRobot =           		true; 	
var NombreDelBot =              		"El Pibe"; 		            					// Si NoQuieroUnRobot es true, ignorar, si es false se le asigna el nombre de NombreDelBot

// - HBINIT del SERVIDOR
var room = HBInit({
	roomName: NombreDelServidor,
    maxPlayers: MaximaCantidadDeJugadores,
    public: SalaPublica,
	password: ContraseñaDeLaSala,
    noPlayer: NoQuieroUnRobot,
	playerName: NombreDelBot,
    token: ServidorToken,
	geo: {
		code: LocalizacionDelServidor,
		lat: Latitud,
		lon: Longitud,
	}
});

// - FUNCIONES GLOBALES
// 1. Definimos los tipos "lunfardos" para que el usuario tenga autocompletado automático.
export interface RoomLunfarda {
  cuandoCaigaUno: (player: any) => void;
  cuandoSeTomeElPalo: (player: any) => void;
  cuandoPinteCharlar: (player: any, message: string) => void;
  
  // Acá vas a ir agregando más funciones a medida que traduzcas todo
}

// 2. Esta función va a envolver la room original de Haxball y traducirla
export function crearCanchaLunfarda(config: any): RoomLunfarda {
  // Inicializamos Haxball de forma nativa
  const roomOriginal = HBInit(config);

  // Creamos el puente traduciendo los eventos usando getters/setters de JS
  const roomTraducida: RoomLunfarda = {
    set cuandoCaigaUno(callback: (player: any) => void) {
      roomOriginal.onPlayerJoin = callback;
    },
    set cuandoSeTomeElPalo(callback: (player: any) => void) {
      roomOriginal.onPlayerLeave = callback;
    },
    set cuandoPinteCharlar(callback: (player: any, message: string) => void) {
      roomOriginal.onPlayerChat = callback;
    }
  };

  return roomTraducida;
}