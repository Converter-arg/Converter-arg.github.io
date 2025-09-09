/* script.js - Transformador César / Lengua aérea (NATO) */

// Mapeo alfabeto fonético NATO (forma en español: "Alfa", "Bravo", "Charlie"...)
const NATO = {
  A: "Alfa", B: "Bravo", C: "Charlie", D: "Delta", E: "Eco",
  F: "Foxtrot", G: "Golf", H: "Hotel", I: "India", J: "Juliett",
  K: "Kilo", L: "Lima", M: "Mike", N: "November", O: "Oscar",
  P: "Papa", Q: "Quebec", R: "Romeo", S: "Sierra", T: "Tango",
  U: "Uniform", V: "Victor", W: "Whiskey", X: "X-ray", Y: "Yankee",
  Z: "Zulu"
};

// DOM
const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const transformBtn = document.getElementById("transformBtn");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const shiftInput = document.getElementById("shift");
const modeRadios = document.getElementsByName("mode");

// util: obtener modo seleccionado
function getMode(){
  for(const r of modeRadios) if(r.checked) return r.value;
  return "cesar";
}

// Cifrado César (preserva mayúsculas/minúsculas, deja otros caracteres)
function caesarShift(str, shift){
  // normalizamos shift en rango -25..25
  shift = Number(shift) || 0;
  shift = ((shift % 26) + 26) % 26; // ahora 0..25
  let out = "";
  for(const ch of str){
    const code = ch.charCodeAt(0);
    // mayúsculas
    if(code >= 65 && code <= 90){
      const base = 65;
      const nc = ((code - base + shift) % 26) + base;
      out += String.fromCharCode(nc);
    }
    // minúsculas
    else if(code >= 97 && code <= 122){
      const base = 97;
      const nc = ((code - base + shift) % 26) + base;
      out += String.fromCharCode(nc);
    } else {
      out += ch;
    }
  }
  return out;
}

// Transformar a lengua aérea (NATO)
// Devuelve cada letra reemplazada por la palabra NATO separada por espacios.
// Conserva mayúsculas/minúsculas originales solo para decidir la separación — la palabra NATO se escribe con primera mayúscula.
function toNATO(str){
  const parts = [];
  for(const ch of str){
    if(/[A-Za-z]/.test(ch)){
      const key = ch.toUpperCase();
      parts.push(NATO[key] ?? key);
    } else if (ch === " "){
      // mantener una barra / separación clara para espacios
      parts.push("/"); // puedes cambiar por "|" o doble espacio si prefieres
    } else {
      // signos de puntuación y números los dejamos tal cual como token separado
      parts.push(ch);
    }
  }
  // Unimos con espacios simples
  return parts.join(" ");
}

// Evento principal
transformBtn.addEventListener("click", () => {
  const text = inputText.value || "";
  const mode = getMode();
  const shift = Number(shiftInput.value) || 0;

  let result = "";

  if(mode === "cesar"){
    result = caesarShift(text, shift);
  } else if(mode === "nato"){
    result = toNATO(text);
  } else if(mode === "both"){
    const intermediate = caesarShift(text, shift);
    result = toNATO(intermediate);
  } else {
    result = text;
  }

  outputText.value = result;
});

// Copiar al portapapeles
copyBtn.addEventListener("click", async () => {
  try{
    await navigator.clipboard.writeText(outputText.value);
    copyBtn.textContent = "Copiado ✓";
    setTimeout(()=> copyBtn.textContent = "Copiar resultado", 1200);
  } catch(e){
    alert("No se pudo copiar automáticamente. Seleccioná el texto y copiá manualmente.");
  }
});

// Limpiar
clearBtn.addEventListener("click", () => {
  inputText.value = "";
  outputText.value = "";
});

// Enviar enter dentro del textarea no debería transformar por accidente; pero podemos permitir Ctrl+Enter para transformar
inputText.addEventListener("keydown", (e) => {
  if(e.key === "Enter" && e.ctrlKey){
    e.preventDefault();
    transformBtn.click();
  }
});
