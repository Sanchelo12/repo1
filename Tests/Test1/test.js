import http from "k6/http";
import { sleep } from "k6";

export const options = {
  vus: 50, // 50 usuarios virtuales al mismo tiempo
  duration: "30s", // Durante 30 segundos
};

export default function () {
  // Atacamos el endpoint que consulta la base de datos
  http.get("http://localhost:3000/usuarios");
  sleep(1);
}

/*
Abre tu terminal de Bash y escribe estos comandos uno por uno:
    - Para ver si tienes winget: winget --version
    - Para ver si tienes k6: k6 version

winget install k6
*/
