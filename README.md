# 🇦🇷 — FUNCIONES de HAXBALL en LUNFARDO ARGENTINO

## ✏️ — INTRODUCCIÓN
Dentro de la comunidad de Haxball sé que radica en una gran parte, y más en la comunidad hispana, los argentinos (yo por ejemplo). Es por eso que, entre ese ir y venir dentro de GitHub, encontré un repositorio que me copó para hacer ésto **(WhiteHeadbanger/Lunfardo)** y decidí ponerme manos a la obra en un juego que amo y que sé que a más de uno le va a gustar. En simples palabras: No es ni más ni menos que una estructura que renombra las funciones principales de Haxball a un lunfardo argento.

## 📄 — FUNCIONAMIENTO
### 👤 — PlayerObject
| Nombre del objeto | Argumentos | Descripción | 
| --- | --- | --- |
| id | (number) | ID único del vago en la sala |
| nombre | (string) | El nombre del jugador, sin más |
| equipo | (number) | 0 = Espectador, 1 = Rojo, 2 = Azul |
| esGorra | (boolean) | Si el vago tiene admin o no |
| coordenadas | ({ x: number; y: number }  null) | Ubicación en tiempo real en la cancha |
| auth | (string null) | Llave de autenticación, un lujo |
| conexion | (string) | IP del jugador |

### 🔧 — Funciones
| Método nuevo | Argumentos | Método original | Descripción |
| --- | --- | --- | --- |
tirarChat | "msg: string, targetId?: number" | sendChat | Manda un mensaje común al chat (a todos o a uno solo)
tirarAnuncio | "msg: string, targetId?: number - null, color?: number, style?: string, sound?: number" | sendAnnouncement | Tira un anuncio destacado con color (hexadecimal) y estilo
darleElOlivo | "playerId: number, razon: string, banear: boolean" | kickPlayer | Patea o banea a un vago de la cancha con su debida razón
ponerseLaGorra | "playerId: number, admin: boolean" | setPlayerAdmin | Le da o le quita la gorra para convertir en admin al jugador
cambiarDeVereda | "playerId: number, teamId: number" | setPlayerTeam | Pasa a un jugador de equipo (0=Spec, 1=Rojo, 2=Azul)
moverLaRedonda | Ninguno | startGame | Da el pitazo inicial y arranca el picadito
pararLaPelota | Ninguno | pauseGame(true) | Pausa el partido para calmar las aguas
terminarElPicadito | Ninguno | stopGame | Termina el juego y manda a todos al lobby
traerListaDeVagos | Ninguno | getPlayerList | Devuelve un array con todos los JugadorLunfardo en la sala

### ⚡ — Físicas
| Método | Argumentos | Método original | Descripción |
| --- | --- | --- | --- |
tunearFisicaDelDisco | "indice: number, propiedades: PropiedadesDelPlatillo" | setDiscProperties | Cambia las físicas de un disco (la bocha es el 0)
mirarFisicaDelDisco | "indice: number,getDiscProperties | Devuelve las propiedades físicas actuales de un disco
tunearFisicaDelVago | "playerId: number, propiedades: PropiedadesDelPlatillo | setPlayerDiscProperties | Modifica las físicas del avatar de un jugador en la cancha
mirarFisicaDelVago | playerId: number,getPlayerDiscProperties | Mira cómo viene la física del avatar de ese jugador
traerCantidadDeDiscos | Ninguno | getDiscCount | Devuelve cuántos discos hay creados en la cancha actual

### 🎉 — Eventos
| Evento | Callback esperado | Método original | ¿Cuándo se ejecuta? |
| --- | --- | --- | --- |
cuandoCaigaUno | (player: JugadorLunfardo) => void | onPlayerJoin | Cuando un nuevo vago entra a la sala
cuandoSeTomeElPalo | (player: JugadorLunfardo) => void | onPlayerLeave | Cuando alguien abandona o se desconecta
cuandoPinteCharlar | "(player: JugadorLunfardo, mensaje: string) => boolean - void" | onPlayerChat | Cuando alguien escribe. Si retorna false, el mensaje se oculta
cuandoSePongaLaBochaEnJuego | () => void | onGameStart | En el momento exacto en que arranca el partido
cuandoAlguienLePegueUnChantazo | (player: JugadorLunfardo) => void | onPlayerBallKick | Cuando un jugador le mete un buen zapatazo a la bocha
cuandoHaganUnGol | (equipoGanador: number) => void | onTeamGoal | ¡GOL! Devuelve 1 si fue del Rojo o 2 si fue del Azul
cuandoSeArmeElBardo | "(player: JugadorLunfardo, razon: string, porCulpade: JugadorLunfardo) => void" | onPlayerKicked | Cuando rajan a alguien; te dice quién marchó, por qué y quién lo echó

## 📁 — DOCUMENTACIÓN
- **Versión 1.0.0 - 20 de Junio, 2026**
- <ins>**DESCRIPCIÓN:**</ins> *Primera versión donde se han creado todas las funciones principales de forma que estén traducidas a un lunfardo argentino. De modo que, se ejecuta los comandos sobre otros nombres.*

## 📦 — EXPLICACIÓN & EJEMPLIFICACIÓN
Haber... No deja de ser los métodos originales con otros nombres, por lo que, es exactamente lo mismo pero con un lenguaje que todos los argentinos nos entendamos de pies a cabeza. Para ejemplificar el uso de los métodos no me voy a extender tanto, aunque faltan muchas más funciones traducidas como ```OnStadiumChange```, ```setCustomStadium```, ```setPassword```, ```startRecording```, ```stopRecording```, etcétera, etcétera, etcétera, que probablemente agregue en otras versiones posteriores.

```ts
// OnPlayerJoin
room.cuandoCaigaUno = (vago) => {
  if (vago.nombre === "ToMaTehh") {
    room.tirarAnuncio("Entró el mecánico. Se pone la gorra.", null, 0xffff00, "bold");
    room.ponerseLaGorra(vago.id, true); // Si entra el dueño del circo, se le da la gorra al toque
  }
};

// OnPlayerChat
room.cuandoPinteCharlar = (vago, mensaje) => {
  if (mensaje === "!bardo") {
    room.tirarChat(`¡${vago.nombre} anda buscando bardo!`);
    return false;
  }
  return true;
};
```

Ahora, como última explicación, haré un sistema de ```!votekick``` bajo estas funciones jajaja. Atentos.
```ts
let vagoEnLaMira: JugadorLunfardo | null = null;
let votosEmitidos = new Set<number>();
let tiempoLimite: NodeJS.Timeout | null = null; // Guardamos el reloj acá
const VOTOS_NECESARIOS = 3;

room.cuandoPinteCharlar = (vago, mensaje) => {
if (mensaje.startsWith("!rajar")) {
    const partes = mensaje.split(" ");
    
    // CASO 1: Arranca una votación nueva
    if (!vagoEnLaMira) {
      if (partes.length < 2) {
        room.tirarChat(`[SISTEMA] Escuchame ${vago.nombre}, poné !rajar [ID o Nombre] para iniciar la votación.`);
        return false;
      }
      
      const objetivoDoc = partes.slice(1).join(" ");
      const listaVagos = room.traerListaDeVagos();
      
      const víctima = listaVagos.find(v => v.id === parseInt(objetivoDoc) || v.nombre.toLowerCase() === objetivoDoc.toLowerCase());
      
      if (!víctima) {
        room.tirarChat(`[SISTEMA] Ese vago no está en la cancha.`);
        return false;
      }
      
      if (víctima.id === vago.id) {
        room.tirarChat(`[SISTEMA] ¡No seas masoquista, no te podés votar a vos mismo!`);
        return false;
      }

      // Inicializamos el bardo
      vagoEnLaMira = víctima;
      votosEmitidos.clear();
      votosEmitidos.add(vago.id);

      room.tirarAnuncio(`⚠️ ¡SE ARMÓ EL VOTEKICK! ${vago.nombre} quiere darle el olivo a ${víctima.nombre}.`, null, COLOR_ROJO, "bold");
      room.tirarAnuncio(`Tienen 30 segundos para votar. Los que se sumen pongan !rajar. Faltan ${VOTOS_NECESARIOS - votosEmitidos.size} votos.`, null, COLOR_AMARILLO);

      // --- RELOJ DE 30 SEGUNDOS
      tiempoLimite = setTimeout(() => {
        if (vagoEnLaMira) {
          room.tirarAnuncio(`⏳ Se enfrió el bardo. Pasaron los 30 segundos y ${vagoEnLaMira.nombre} se queda en la cancha porque no juntaron los votos.`, null, COLOR_VERDE);
          // Limpiamos todo
          vagoEnLaMira = null;
          votosEmitidos.clear();
          tiempoLimite = null;
        }
      }, 30000); // 30000 milisegundos = 30 segundos

      return false;
    }

    // CASO 2: La votación ya está en curso y entra otro voto
    if (vagoEnLaMira) {
      if (votosEmitidos.has(vago.id)) {
        room.tirarChat(`[SISTEMA] Pará la mano ${vago.nombre}, ya votaste una vez.`);
        return false;
      }

      if (vago.id === vagoEnLaMira.id) {
        room.tirarAnuncio(`[SISTEMA] ¡Vos sos el acusado, vos no votás! Ajajaja.`, vago.id, COLOR_AMARILLO, "bold");
        return false;
      }

      votosEmitidos.add(vago.id);
      const restantes = VOTOS_NECESARIOS - votosEmitidos.size;

      if (restantes > 0) {
        room.tirarChat(`📢 ${vago.nombre} votó a favor de rajarlo. ¡Faltan ${restantes} votos!`);
      } else {
        // --- SE JUNTARON LOS VOTOS ANTES DEL TIEMPO
        if (tiempoLimite) {
          clearTimeout(tiempoLimite); // Cancelamos el reloj para que no tire el mensaje de tiempo agotado
          tiempoLimite = null;
        }

        room.tirarAnuncio(`🚨 ¡El pueblo habló! A pedido de la hinchada, se la damos a ${vagoEnLaMira.nombre}.`, null, COLOR_ROJO, "bold");
        room.darleElOlivo(vagoEnLaMira.id, "Rajado por votación popular", false);
        
        vagoEnLaMira = null;
        votosEmitidos.clear();
      }
      return false;
    }
  }

  return true;
};
