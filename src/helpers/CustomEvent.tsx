// events.js

function on(eventType: any, listener: any) {
  document.addEventListener(eventType, listener);
}

function off(eventType: any, listener: any) {
  document.removeEventListener(eventType, listener);
}

function trigger(eventType: any, data: any) {
  const event = new CustomEvent(eventType, { detail: data });
  console.log(document,event)
  document.dispatchEvent(event);
}

export { on, off, trigger };
