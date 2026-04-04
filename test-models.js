async function check() {
  try {
    const key = process.env.GEMINI_API_KEY;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await response.json();
    console.log("AVAILABLE MODELS:");
    console.log(data.models?.map(m => m.name).join('\n'));
  } catch (e) {
    console.log(e);
  }
}

check();
