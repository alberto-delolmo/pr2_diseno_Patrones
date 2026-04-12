# 🛒 Sistema de Pedidos - React + TypeScript

Aplicación web para la creación de pedidos utilizando patrones de diseño (Decorator y Observer).

---

## 🚀 Requisitos

* Node.js instalado
* npm o yarn

---

## ⚙️ Instalación

Clonar el repositorio:

```bash
git clone https://github.com/alberto-delolmo/pr2_diseno_Patrones.git
cd pr2_diseno_Patrones
```

Instalar dependencias:

```bash
npm install
```

---

## ▶️ Ejecución

### 🔹 1. Iniciar Frontend

```bash
npm run dev
```

Abrir en el navegador:

```
http://localhost:5173
```

---

### 🔹 2. Iniciar Backend

En otra terminal:

```bash
cd src
npx ts-node backend/server.ts
```

El backend estará en:

```
http://localhost:3001
```

---

## 🧪 Uso

1. Introducir el precio base
2. Añadir opcionalmente:

   * Descuento
   * Impuesto
   * Envío
   * Recargo
3. (Opcional) Introducir email
4. Pulsar **Confirmar Pedido**

---

## 🧠 Patrones utilizados

* **Decorator** → Para aplicar descuentos, impuestos, envío y recargos
* **Observer** → Para notificaciones (consola, pantalla, fichero de texto, popup)

---

## 📁 Estructura

```
src/
 ├── frontend/
 ├── backend/
 ├── components/
```

