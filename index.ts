/*
		# ToMaTehhh/functions-haxball-lunfardo-argentino
		
		# DESCRIPCIÓN:
    	# Librería de funciones en TypeScript para desarrollar scripts de Haxball utilizando la jerga del lunfardo argentino.
		
		# PROGRAMACIÓN:
		# by ToMaTeh aka mecánico

*/

// @ts-check
import { HBInit } from 'haxball.js';


// - CONFIGURACIÓN GLOBAL DEL SERVIDOR
var NombreDelServidor =					   	""; 			                // Nombre del servidor
var MaximaCantidadDeJugadores = 			10; 							// Cantidad de jugadores máxima permitida en la sala (entre 2 y 30)
var ServidorToken =             			""; 		                  	// Token del servidor
										
var SalaPublica =               			true; 							// true = pública, false = privada
var ContraseñaDeLaSala = 			    	"123";							// Si SalaPublica = false, la contraseña es ContraseñaDeLaSala

var LocalizacionDelServidor =   			"AR"; 							// AR = Argentina
var Latitud	=						        -38.872;									    
var Longitud = 					        	-58.3819;

var NoQuieroUnRobot =           	 		true; 	
var NombreDelBot =              			"El Pibe"; 		            	// Si NoQuieroUnRobot es true, ignorar, si es false se le asigna el nombre de NombreDelBot

// - COLORES (Sí, medio tosco pero los usamos en hexadecimal para que la API entienda, el formato es: const COLOR_HTML = 0xCODIGO_COLOR)
const COLOR_AMARILLO = 0xffff00;
const COLOR_ROJO     = 0xff0000;
const COLOR_AZUL     = 0x0000ff;
const COLOR_VERDE    = 0x00ff00;
const COLOR_CYAN     = 0x00ffff;
const COLOR_MAGENTA  = 0xff00ff;
const COLOR_BLANCO   = 0xffffff;

// En vez de player, usamos JugadorLunfardo para tener más pinta
export interface JugadorLunfardo {
  id: number;
  nombre: string;
  equipo: number;                                 // team: 0 = Espectador, 1 = Rojo, 2 = Azul
  esGorra: boolean;                               // admin
  coordenadas: { x: number; y: number } | null;   // position
  auth: string | null;
  conexion: string;                               // conn
}

export interface PropiedadesDelPlatillo {
  acaX?: number;          // x
  acaY?: number;          // y
  vueloX?: number;        // xspeed
  vueloY?: number;        // yspeed
  vientoX?: number;       // xgravity
  vientoY?: number;       // ygravity
  gordura?: number;       // radius
  rebote?: number;        // bCoeff
  ligereza?: number;      // invMass
  freno?: number;         // damping
  color?: number;         // color
}

const aPropiedadesLunfardas = (d: any): PropiedadesDelPlatillo => ({
    acaX: d.x, acaY: d.y, vueloX: d.xspeed, vueloY: d.yspeed, vientoX: d.xgravity, vientoY: d.ygravity,
    gordura: d.radius, rebote: d.bCoeff, ligereza: d.invMass, freno: d.damping, color: d.color
  });

  const aPropiedadesNativas = (l: PropiedadesDelPlatillo): any => ({
    x: l.acaX, y: l.acaY, xspeed: l.vueloX, yspeed: l.vueloY, xgravity: l.vientoX, ygravity: l.vientoY,
    radius: l.gordura, bCoeff: l.rebote, invMass: l.ligereza, damping: l.freno, color: l.color
  });

// - FUNCIONES GLOBALES
// Definimos los tipos "lunfardos" para que el usuario tenga autocompletado automático
export interface RoomLunfarda {
  // --- EVENTOS
  cuandoCaigaUno: (JugadorLunfardo: any) => void;                                                                // OnPlayerJoin
  cuandoSeTomeElPalo: (JugadorLunfardo: any) => void;                                                            // OnPlayerLeave
  cuandoPinteCharlar: (JugadorLunfardo: any, message: string) => void;                                           // OnPlayerChat
  cuandoSePongaLaBochaEnJuego: () => void;                                                                       // OnPlayerStart
  cuandoAlguienLePegueUnChantazo: (player: JugadorLunfardo) => void;                                             // OnPlayerBallKick
  cuandoHaganUnGol: (equipoGanador: number) => void;                                                             // OnPlayerGoal
  cuandoSeArmeElBardo: (player: JugadorLunfardo, razon: string, porCulpade: JugadorLunfardo) => void;            // OnPlayerKicked

  // --- MÉTODOS
  tirarChat: (msg: string, targetId?: number) => void;                                                           // sendChat
  tirarAnuncio: (msg: string, targetId?: number | null, color?: number, style?: string, sound?: number) => void; // sendAnnouncement
  darleElOlivo: (playerId: number, razon: string, banear: boolean) => void;                                      // kickPlayer (unifica kick/ban)
  ponerseLaGorra: (playerId: number, admin: boolean) => void;                                                    // setPlayerAdmin
  cambiarDeVereda: (playerId: number, teamId: number) => void;                                                   // setPlayerTeam
  moverLaRedonda: () => void;                                                                                    // startGame
  pararLaPelota: () => void;                                                                                     // pauseGame
  terminarElPicadito: () => void;                                                                                // stopGame
  traerListaDeVagos: () => JugadorLunfardo[];                                                                    // getPlayerList

  // --- FÍSICAS
  tunearFisicaDelDisco: (indice: number, propiedades: PropiedadesDelPlatillo) => void;                           // setDiscProperties
  mirarFisicaDelDisco: (indice: number) => PropiedadesDelPlatillo;                                               // getDiscProperties
  tunearFisicaDelVago: (playerId: number, propiedades: PropiedadesDelPlatillo) => void;                          // setPlayerDiscProperties
  mirarFisicaDelVago: (playerId: number) => PropiedadesDelPlatillo;                                              // getPlayerDiscProperties
  
  traerCantidadDeDiscos: () => number;
}

export function crearCanchaLunfarda(config: any): RoomLunfarda {
  const roomOriginal = HBInit(config);

  // Función interna para traducir el PlayerObject nativo al formato argento
  const traducirJugador = (p: any): JugadorLunfardo => ({
    id: p.id,
    nombre: p.name,
    equipo: p.team,
    esGorra: p.admin,
    coordenadas: p.position,
    auth: p.auth,
    conexion: p.conn
  });

const roomTraducida: RoomLunfarda = {
    // --- TRADUCCIÓN DE MÉTODOS
    tirarChat: (msg, targetId) => roomOriginal.sendChat(msg, targetId),
    tirarAnuncio: (msg, targetId, color, style, sound) => roomOriginal.sendAnnouncement(msg, targetId, color, style, sound),
    darleElOlivo: (playerId, razon, banear) => roomOriginal.kickPlayer(playerId, razon, banear),
    ponerseLaGorra: (playerId, admin) => roomOriginal.setPlayerAdmin(playerId, admin),
    cambiarDeVereda: (playerId, teamId) => roomOriginal.setPlayerTeam(playerId, teamId as any),
    moverLaRedonda: () => roomOriginal.startGame(),
    pararLaPelota: () => roomOriginal.pauseGame(true),
    terminarElPicadito: () => roomOriginal.stopGame(),
    traerListaDeVagos: () => roomOriginal.getPlayerList().map(traducirJugador),

    // --- TRADUCCIÓN DE EVENTOS
    set cuandoCaigaUno(callback: (player: JugadorLunfardo) => void) {
      roomOriginal.onPlayerJoin = (player: any) => callback(traducirJugador(player));
    },
    set cuandoSeTomeElPalo(callback: (player: JugadorLunfardo) => void) {
      roomOriginal.onPlayerLeave = (player: any) => callback(traducirJugador(player));
    },
    set cuandoPinteCharlar(callback: (player: JugadorLunfardo, mensaje: string) => boolean | void) {
      roomOriginal.onPlayerChat = (player: any, message: string) => {
        const resultado = callback(traducirJugador(player), message);
        
        // Si el usuario retornó explícitamente false, le devolvemos false a Haxball para ocultar el mensaje
        if (resultado === false) {
          return false;
        }
        return true;
      };
    },
    set cuandoSePongaLaBochaEnJuego(callback: () => void) {
      roomOriginal.onGameStart = callback;
    },
    set cuandoAlguienLePegueUnChantazo(callback: (player: JugadorLunfardo) => void) {
      roomOriginal.onPlayerBallKick = (player: any) => callback(traducirJugador(player));
    },
    set cuandoHaganUnGol(callback: (equipoGanador: number) => void) {
      roomOriginal.onTeamGoal = callback;
    },
    set cuandoSeArmeElBardo(callback: (player: JugadorLunfardo, razon: string, porCulpade: JugadorLunfardo) => void) {
      roomOriginal.onPlayerKicked = (player: any, reason: string, ban: boolean, byPlayer: any) => {
        callback(traducirJugador(player), reason, traducirJugador(byPlayer));
      };
    },
    // --- TRADUCCIÓN DE FÍSICAS
    tunearFisicaDelDisco: (indice, props) => roomOriginal.setDiscProperties(indice, aPropiedadesNativas(props)),
    mirarFisicaDelDisco: (indice) => aPropiedadesLunfardas(roomOriginal.getDiscProperties(indice)),
    tunearFisicaDelVago: (playerId, props) => roomOriginal.setPlayerDiscProperties(playerId, aPropiedadesNativas(props)),
    mirarFisicaDelVago: (playerId) => aPropiedadesLunfardas(roomOriginal.getPlayerDiscProperties(playerId)),
    traerCantidadDeDiscos: () => roomOriginal.getDiscCount(),
  };

  return roomTraducida;
}

// - INICIALIZACIÓN DE TU CANCHITA
var room = crearCanchaLunfarda({
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


// - EJEMPLOS
room.cuandoCaigaUno = (vago) => {
  room.tirarChat(`¡Eeeesa! Se sumó el loco ${vago.nombre} al picadito.`);
  
  // Si entra el dueño del circo, le damos la cinta automáticamente
  if (vago.nombre === "ToMaTehhh") {
    room.tirarAnuncio("Alto gil, entró ToMaTehh, se pone la gorra de una el loco.", null, COLOR_AMARILLO, "bold");
    room.ponerseLaGorra(vago.id, true);
  }
};

room.cuandoPinteCharlar = (vago, mensaje) => {
  if (mensaje === "!bardo") {
    room.tirarAnuncio(`¡${vago.nombre} está buscando bardo!`);
    return false;
  }
	
  if (mensaje === "!hielo") {
    room.tunearFisicaDelDisco(0, { // El disco 0 siempre es la bocha
      freno: 1,        // No se frena nunca por el roce
      rebote: 1.5      // Rebota más que antes
    });
    room.tirarChat("¡La cancha es una pista de patinaje!");
    return false;
  }
	
  return true;
};
