/*---¿Para qué sirve el archivo hosts?
El archivo hosts es el primer lugar donde mira Windows antes de ir a Internet.
    - Cuando escribes api-uno.test, Windows no sabe qué es eso.
    - Al poner 127.0.0.1 api-uno.test, le dices: "No busques en Google, esta dirección soy yo mismo (mi PC)".
    - El navegador entonces empaqueta tu petición y la envía a la IP 127.0.0.1 en el puerto 443.

---¿Cómo sabe Docker que el dominio era api-uno.test?
Aquí está el truco: Cuando el navegador envía una petición HTTP/HTTPS, dentro del paquete de datos hay una "etiqueta" llamada Header Host.
    - Aunque el paquete viaje a la IP 127.0.0.1, el contenido dice:
    - "Hola, soy una petición dirigida específicamente al dominio api-uno.test".
    - Como tienes el puerto 443:443 en Docker, ese paquete entra directo al contenedor de Nginx.

---¿Y cómo sabe Nginx que api-uno.test es para la API Uno?
Nginx tiene una configuración (nginx.conf) que dice:
    - "Si recibo una petición con el Host api-uno.test, envíala al backend que está en http://api-uno:5001".
    - "Si recibo una petición con el Host api-dos.test, envíala al backend que está en http://api-dos:5002".
    - Nginx actúa como un portero que lee la etiqueta del paquete (Host) y decide a qué puerta (backend) enviarlo.

---El server_name
En la configuración de Nginx, el server_name es como un filtro que le dice a Nginx: "Solo acepta peticiones que tengan esta etiqueta específica en el Host".
    - Si el Host no coincide con el server_name, Nginx no sabe a dónde enviar la petición y responde con un error 404.

Nginx actúa como un clasificador de correo:
    - Mira la lista de todos sus bloques server.
    - Compara el Header Host que envió el navegador con los server_name que tú escribiste.
    - Si el navegador dice api-uno.test, Nginx usa las reglas de ese bloque. Si dice api-dos.test, usa el otro.

---¿Qué pasa si escribo http://localhost:5001?
Si escribes http://localhost:5001, tu navegador envía una petición directa a la IP 127.0.0.1 en el puerto 5001.
    - En este caso, el paquete no tiene la etiqueta Host api-uno.test, sino localhost.
    - Nginx no interviene porque no está escuchando en el puerto 5001, así que la petición va directo a la API Uno.
    - La API Uno recibe la petición, pero como no viene de Nginx (no tiene la cabecera secreta), responde con un error 403.

---¿Qué pasa si escribo http://api-uno.test:5001?
Si escribes http://api-uno.test:5001, tu navegador envía una petición a la IP 127.0.0.1 en el puerto 5001.
    - En este caso, el paquete no tiene la etiqueta Host api-uno.test, sino api-uno.test.
    - Nginx no interviene porque no está escuchando en el puerto 5001, así que la petición va directo a la API Uno.
    - La API Uno recibe la petición, pero como no viene de Nginx (no tiene la cabecera secreta), responde con un error 403.

---El viaje de la petición (¿Por qué no va a YouTube?)
Cuando escribes algo en la barra de direcciones, el navegador tiene que decidir a qué IP enviar los datos.
    - Si pones https://youtube.com, el navegador le pregunta a un servidor DNS: "¿Cuál es la IP de YouTube?". El DNS responde algo como 142.250.x.x y la petición se va a los servidores de Google.

    - Si pones https://api-uno.test, el navegador le pregunta a Windows. Como lo pusiste en el archivo hosts, Windows dice: "Esa IP es 127.0.0.1 (tú mismo)".

    - Por eso es obligatorio el archivo hosts: Sin él, el navegador intentaría buscar api-uno.test en internet, no encontraría nada y te daría error. El archivo hosts "engaña" al navegador para que mande el tráfico al puerto 443 de tu Docker.

---¿Qué es ese famoso "Header Host"?
Cuando el navegador se conecta a tu Nginx (que está escuchando en el 443), no solo manda la URL. Manda un bloque de texto llamado HTTP Headers. Uno de ellos es, literalmente:
    - Host: api-uno.test
Existe y es obligatorio en el protocolo HTTP/1.1 y superiores. Es la única forma que tiene un servidor para saber a qué página web quieres entrar si ese servidor aloja muchas páginas distintas en la misma IP.

---¿Qué es localhost?
Como bien dijiste, es una dirección IP (específicamente la 127.0.0.1). Es el nombre que tu computadora usa para hablar consigo misma. Imagina que es la dirección de tu casa.

---¿Qué es el :3000?
Es el puerto. Si la IP es la dirección de tu casa, el puerto es la puerta específica por la que quieres entrar.
    - Una computadora tiene 65,535 puertos disponibles.
    - Tu API de Node.js está "escuchando" detrás de la puerta 3000.
    - Tu base de datos Postgres está detrás de la puerta 5432.

---El misterio del HTTPS y el puerto 443
Aquí es donde está el truco. Los protocolos tienen puertos por defecto para que no tengamos que escribirlos en el navegador:
    - HTTP usa por defecto el puerto 80.
    - HTTPS usa por defecto el puerto 443.
    - Cuando escribes https://google.com, el navegador asume automáticamente que quieres ir al puerto 443. Es como si escribieras https://google.com:443, pero el navegador lo oculta para que sea más bonito.

---Entonces, ¿por qué ponemos https://localhost:3000?
Cuando pones los dos puntos y un número, estás haciendo un "Override" (anulación). Le estás diciendo al navegador:
    - "Usa el protocolo seguro (HTTPS), pero NO vayas a la puerta que usas siempre (443). Ve a la puerta 3000".
Si no pones puerto, el navegador usa el de "fábrica" del protocolo (80 o 443). Si lo pones, el navegador va exactamente a donde tú le ordenes.

---Un protocolo no está "encadenado" a un puerto.
Si tú escribes https://localhost:5001, el navegador irá a la puerta 5001 e intentará iniciar un "apretón de manos" (handshake) de seguridad. Si tu API no está configurada para HTTPS en ese puerto, la conexión fallará porque el navegador hablará un idioma que la API no entiende.

-- En tu experimento (El caso Nginx)
Aquí es donde se pone interesante tu configuración:
    - Navegador a Nginx (https://api-uno.test): Aquí usas HTTPS en el puerto 443. Nginx tiene los certificados y descifra la información.
    - Nginx a API (http://host.docker.internal:5001): ¡Fíjate bien! Aquí Nginx cambia el protocolo a HTTP (sin la S).

---¿Qué pasa si escribo https://localhost:3000?
Si escribes https://localhost:3000, tu navegador intentará establecer una conexión segura (HTTPS) con la IP 127.0.0.1 en el puerto 3000.
 */
