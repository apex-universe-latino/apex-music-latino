const fs = require('fs');
let html = fs.readFileSync('artist-portal/index.html', 'utf8');

// 1. Scaffold view-identity (EPK)
const identityView = `
      <!-- ========== IDENTITY LAB (EPK) ========== -->
      <div id="view-identity" class="view">
        <h2 style="font-size: 28px; font-weight: 700; margin-bottom: 24px;">Identity Lab (EPK)</h2>
        <div style="background: var(--bg-elevated); padding: 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);">
          <h3 style="font-size: 16px; margin-bottom: 16px;">Generador de Electronic Press Kit</h3>
          <div style="display: grid; gap: 16px;">
            <input type="text" placeholder="Nombre Artístico" style="width: 100%; padding: 12px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff;">
            <textarea placeholder="Biografía (Generada por AI)" rows="4" style="width: 100%; padding: 12px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff;"></textarea>
            <div style="display: flex; gap: 12px;">
              <button style="flex: 1; padding: 12px; background: var(--purple); color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Generar EPK con Roxy</button>
            </div>
          </div>
        </div>
      </div>
`;

html = html.replace(/<div id="view-identity" class="view">[\s\S]*?<\/div>\s*<!-- ==========/, identityView + '\n      <!-- ==========');

// 2. Scaffold view-assets (QR Code)
const assetsView = `
      <!-- ========== ASSETS (QR) ========== -->
      <div id="view-assets" class="view">
        <h2 style="font-size: 28px; font-weight: 700; margin-bottom: 24px;">QR & Assets</h2>
        <div style="background: var(--bg-elevated); padding: 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; gap: 24px;">
          <div style="width: 150px; height: 150px; background: #fff; border-radius: 16px; display: flex; align-items: center; justify-content: center;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://arcoiris.fm" alt="QR Code" style="border-radius: 8px;">
          </div>
          <div>
            <h3 style="font-size: 18px; margin-bottom: 8px;">Tu Código QR Arcoiris</h3>
            <p style="color: rgba(255,255,255,0.6); margin-bottom: 16px;">Comparte este código para capturar leads y dirigirlos a tu Landing Page.</p>
            <button style="padding: 10px 20px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: #fff; cursor: pointer;">Descargar PNG</button>
          </div>
        </div>
      </div>
`;

if (!html.includes('id="view-assets"')) {
  html = html.replace(/(<div id="view-identity" class="view">[\s\S]*?<!-- ==========)/, '$1\n' + assetsView + '\n');
}

// 3. Scaffold view-broadcast (Landing Page & Mass Broadcast)
const broadcastView = `
      <!-- ========== BROADCAST HUB (LANDING PAGE) ========== -->
      <div id="view-broadcast" class="view">
        <h2 style="font-size: 28px; font-weight: 700; margin-bottom: 24px;">Broadcast Hub & Landing Pages</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
          <div style="background: var(--bg-elevated); padding: 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);">
            <h3 style="font-size: 16px; margin-bottom: 16px;"><span class="material-symbols-outlined" style="vertical-align: middle; margin-right: 8px; color: var(--pink);">web</span> Landing Page Generator</h3>
            <p style="color: rgba(255,255,255,0.6); margin-bottom: 16px;">Despliega una página de captura de leads (Emails/Teléfonos) optimizada para conversión.</p>
            <button style="width: 100%; padding: 12px; background: var(--pink); color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Publicar Landing Page</button>
          </div>
          <div style="background: var(--bg-elevated); padding: 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);">
            <h3 style="font-size: 16px; margin-bottom: 16px;"><span class="material-symbols-outlined" style="vertical-align: middle; margin-right: 8px; color: var(--purple);">campaign</span> Mass Broadcast</h3>
            <p style="color: rgba(255,255,255,0.6); margin-bottom: 16px;">Envía SMS o Emails a tu Fan Rolodex usando SMTP o integraciones de mensajería.</p>
            <button style="width: 100%; padding: 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; border-radius: 8px; font-weight: 600; cursor: pointer;">Crear Campaña</button>
          </div>
        </div>
      </div>
`;

html = html.replace(/<div id="view-broadcast" class="view">[\s\S]*?<\/div>\s*<!-- ==========/, broadcastView + '\n      <!-- ==========');

// 4. Update the Onboarding Wizard to the 4-step modal
const newOnboardingScript = `
// New Artist Setup Wizard Controller
window.OnboardingWizard = {
  step: 1,
  totalSteps: 4,
  init: function() {
    // Only run if not completed (simulated)
    if (!localStorage.getItem('cubo_onboarding_completed')) {
      this.renderOverlay();
      this.showStep(1);
    }
  },
  renderOverlay: function() {
    const overlay = document.createElement('div');
    overlay.id = 'wizard-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(8px);z-index:9999;display:flex;align-items:center;justify-content:center;';
    
    overlay.innerHTML = \`
      <div id="wizard-modal" style="background:#130e24; border:1px solid rgba(128,0,255,0.3); border-radius:24px; width:500px; max-width:90vw; padding:32px; box-shadow:0 24px 48px rgba(0,0,0,0.5), 0 0 40px rgba(139,92,246,0.1); position:relative; overflow:hidden;">
        <!-- decorative bg -->
        <div style="position:absolute; top:-50%; left:-50%; width:200%; height:200%; background:radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 60%); pointer-events:none;"></div>
        
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; position:relative; z-index:1;">
          <h3 id="wizard-title" style="font-size:20px; font-weight:700; margin:0;">Bienvenido a CUBO FRM</h3>
          <span id="wizard-counter" style="font-size:12px; font-family:'JetBrains Mono',monospace; color:var(--text-muted); background:rgba(255,255,255,0.05); padding:4px 10px; border-radius:12px;">Paso 1 de 4</span>
        </div>
        
        <div id="wizard-content" style="position:relative; z-index:1; min-height:120px; margin-bottom:32px; color:rgba(255,255,255,0.8); line-height:1.6; font-size:15px;">
          <!-- Content injected here -->
        </div>
        
        <div style="display:flex; justify-content:flex-end; gap:12px; position:relative; z-index:1;">
          <button id="wizard-skip" onclick="OnboardingWizard.skip()" style="padding:10px 20px; background:transparent; border:none; color:rgba(255,255,255,0.4); font-weight:600; cursor:pointer;">Saltar</button>
          <button id="wizard-next" onclick="OnboardingWizard.next()" style="padding:10px 24px; background:var(--purple); color:#fff; border:none; border-radius:8px; font-weight:600; cursor:pointer; box-shadow:0 4px 12px rgba(139,92,246,0.3);">Comenzar →</button>
        </div>
      </div>
    \`;
    document.body.appendChild(overlay);
  },
  showStep: function(n) {
    this.step = n;
    document.getElementById('wizard-counter').innerText = \`Paso \${n} de \${this.totalSteps}\`;
    const title = document.getElementById('wizard-title');
    const content = document.getElementById('wizard-content');
    const btnNext = document.getElementById('wizard-next');
    
    switch(n) {
      case 1:
        title.innerText = 'Crea tu Identidad (EPK)';
        content.innerHTML = '<p>El primer paso es configurar tu <strong>Electronic Press Kit (EPK)</strong>. Esto servirá como tu carta de presentación digital.</p><p style="margin-top:12px; font-size:13px; color:var(--text-muted);"><span class="material-symbols-outlined" style="font-size:16px; vertical-align:middle; color:var(--purple);">auto_awesome</span> Roxy (Tu agente de PR) usará esto para promocionarte.</p>';
        btnNext.innerText = 'Siguiente →';
        switchView('identity');
        break;
      case 2:
        title.innerText = 'Genera tu Código QR';
        content.innerHTML = '<p>Ahora, generemos un <strong>Código QR único</strong>. Puedes imprimirlo en tus shows para que los fans lo escaneen y se unan a tu base de datos (Fan Rolodex).</p>';
        btnNext.innerText = 'Siguiente →';
        switchView('assets');
        break;
      case 3:
        title.innerText = 'Despliega tu Landing Page';
        content.innerHTML = '<p>El QR necesita un destino. Publica tu <strong>Landing Page de Captura</strong> para empezar a recolectar correos y números de teléfono (Leads).</p>';
        btnNext.innerText = 'Siguiente →';
        switchView('broadcast');
        break;
      case 4:
        title.innerText = 'Despierta a tus Agentes';
        content.innerHTML = '<p>Finalmente, tus <strong>Agentes de Inteligencia</strong> (Kujo, Benji, Fido, Roxy) están listos.</p><p style="margin-top:12px; font-size:13px; color:var(--text-muted);">Haz clic en "Activar" para abrir el Panel de Control del Agente y asignarles Skills.</p>';
        btnNext.innerText = 'Activar Agentes ⚡';
        switchView('dashboard');
        break;
      default:
        this.finish();
    }
  },
  next: function() {
    if (this.step < this.totalSteps) {
      this.showStep(this.step + 1);
    } else {
      this.finish();
      // Auto open Benji claw to demonstrate
      openAgentClaw('Benji', 'Monetize', '💰');
    }
  },
  skip: function() {
    this.finish();
  },
  finish: function() {
    const overlay = document.getElementById('wizard-overlay');
    if (overlay) overlay.remove();
    localStorage.setItem('cubo_onboarding_completed', 'true');
  }
};

// Start wizard when page loads (for testing, we clear it first so you can see it)
localStorage.removeItem('cubo_onboarding_completed');
setTimeout(() => OnboardingWizard.init(), 1000);
`;

// Replace the old window.Onboarding
html = html.replace(/window\.Onboarding\s*=[\s\S]*?<\/script>\s*<!-- AGENT CLAW DRAWER -->/, newOnboardingScript + '\n</script>\n\n<!-- AGENT CLAW DRAWER -->');

fs.writeFileSync('artist-portal/index.html', html);
console.log('Applied views and wizard logic');
