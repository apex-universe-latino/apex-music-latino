const fs = require('fs');

let html = fs.readFileSync('artist-portal/index.html', 'utf8');

// 1. Remove the agent dock HTML
html = html.replace(/<div class="agent-dock">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '');

// 2. Remove the agent dock CSS
html = html.replace(/\.agent-dock\s*\{[\s\S]*?\}\s*\.dock-item\s*\{[\s\S]*?\}\s*\.dock-item:hover\s*\{[\s\S]*?\}\s*\.dock-item\.active\s*\{[\s\S]*?\}\s*\.dock-item\.center-icon\s*\{[\s\S]*?\}\s*\.dock-item\.center-icon::before\s*\{[\s\S]*?\}\s*\.dock-item\.center-icon:hover\s*\{[\s\S]*?\}/, '');

// 3. Update the Logo in the sidebar
html = html.replace(/<div class="logo-icon" style="background: var\(--gradient-brand\); border-radius: 8px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; margin-right: 12px; box-shadow: 0 4px 12px rgba\(255, 0, 128, 0\.3\);">[\s\S]*?<\/div>/,
`<img src="../assetts/cubo_frm_logo.svg" style="width: 40px; height: 40px; margin-right: 12px; filter: drop-shadow(0 2px 8px rgba(255,0,128,0.4));" />`);

// Remove the text next to it to match the FRM logo standalone feel? The logo says CUBO FRM already, but it's large.
// Let's just keep the text "CUBO™" for now but smaller if needed. Actually, if I just use the logo, it's better.
html = html.replace(/<div>\s*<h2 style="font-size: 16px; font-weight: 800; letter-spacing: 2px; color: #fff; margin: 0;">CUBO™<\/h2>\s*<p style="font-size: 10px; color: var\(--pink\); font-weight: 600; letter-spacing: 1px; margin: 0;">FRM<\/p>\s*<\/div>/,
`<div><h2 style="font-size: 18px; font-weight: 800; letter-spacing: 2px; color: #fff; margin: 0;">CUBO™</h2><p style="font-size: 10px; color: var(--pink); font-weight: 600; letter-spacing: 1px; margin: 0;">FRM</p></div>`);

// 4. Add the right-side claw drawer HTML right before </body>
const drawerHTML = `
<!-- AGENT CLAW DRAWER -->
<div id="agent-claw" style="position: fixed; top: 0; right: -400px; width: 400px; height: 100vh; background: var(--bg-card); border-left: 1px solid rgba(255,255,255,0.05); z-index: 1000; transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: -10px 0 30px rgba(0,0,0,0.5); display: flex; flex-direction: column;">
  <div style="padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center;">
    <div style="display: flex; align-items: center; gap: 12px;">
      <div id="claw-agent-icon" style="width: 40px; height: 40px; border-radius: 8px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 20px;">🤖</div>
      <div>
        <h3 id="claw-agent-name" style="color: #fff; font-size: 18px; font-weight: 700; margin: 0;">Agent</h3>
        <p id="claw-agent-role" style="color: var(--text-muted); font-size: 12px; margin: 0;">Role</p>
      </div>
    </div>
    <button onclick="closeAgentClaw()" style="background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 24px;">&times;</button>
  </div>
  
  <div style="padding: 24px; flex: 1; overflow-y: auto;">
    <h4 style="color: #fff; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">Agent Brain / Heartbeat</h4>
    <div style="background: var(--bg-inner); border-radius: 8px; padding: 16px; margin-bottom: 24px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #10b981;">
      > STATUS: ACTIVE<br>
      > MEMORY: 98% SYNCED<br>
      > LAST ACTION: 2m ago<br>
      <span class="blinking-cursor">_</span>
    </div>

    <h4 style="color: #fff; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">Add Skills</h4>
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <button style="width: 100%; padding: 12px; background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.2); border-radius: 8px; color: var(--text-muted); cursor: pointer; text-align: left; display: flex; align-items: center; gap: 8px;">
        <span style="color: var(--cyan);">+</span> Add new SOP
      </button>
      <button style="width: 100%; padding: 12px; background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.2); border-radius: 8px; color: var(--text-muted); cursor: pointer; text-align: left; display: flex; align-items: center; gap: 8px;">
        <span style="color: var(--purple);">+</span> Connect Integration
      </button>
    </div>
  </div>
</div>

<script>
function openAgentClaw(name, role, icon) {
  document.getElementById('claw-agent-name').innerText = name;
  document.getElementById('claw-agent-role').innerText = role;
  document.getElementById('claw-agent-icon').innerText = icon;
  document.getElementById('agent-claw').style.right = '0';
}
function closeAgentClaw() {
  document.getElementById('agent-claw').style.right = '-400px';
}
</script>
`;
if (!html.includes('id="agent-claw"')) {
  html = html.replace('</body>', drawerHTML + '\n</body>');
}

// 5. Make Agentes CUBO items clickable
html = html.replace(/<div style="display: flex; align-items: center; gap: 16px; padding: 16px; background: var\(--bg-elevated\); border: 1px solid rgba\(255,255,255,0\.05\); border-radius: 12px; transition: all 0\.2s;">/g, 
'<div style="display: flex; align-items: center; gap: 16px; padding: 16px; background: var(--bg-elevated); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; transition: all 0.2s; cursor: pointer;" onclick="openAgentClaw(\'Agent\', \'Role\', \'🤖\')" class="agent-card-hover">');

// Add specific onclicks
html = html.replace(/onclick="openAgentClaw\('Agent', 'Role', '🤖'\)" class="agent-card-hover">\s*<div style="width: 40px; height: 40px; border-radius: 8px; background: rgba\(255,255,255,0\.05\); display: flex; align-items: center; justify-content: center; font-size: 18px;">\s*⚡\s*<\/div>\s*<div>\s*<h4 style="color: #fff; margin: 0; font-size: 14px; font-weight: 600;">Kujo<\/h4>/,
`onclick="openAgentClaw('Kujo', 'Deals', '⚡')" class="agent-card-hover">
              <div style="width: 40px; height: 40px; border-radius: 8px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 18px;">
                ⚡
              </div>
              <div>
                <h4 style="color: #fff; margin: 0; font-size: 14px; font-weight: 600;">Kujo</h4>`);

html = html.replace(/onclick="openAgentClaw\('Agent', 'Role', '🤖'\)" class="agent-card-hover">\s*<div style="width: 40px; height: 40px; border-radius: 8px; background: rgba\(255,255,255,0\.05\); display: flex; align-items: center; justify-content: center; font-size: 18px;">\s*💰\s*<\/div>\s*<div>\s*<h4 style="color: #fff; margin: 0; font-size: 14px; font-weight: 600;">Benji<\/h4>/,
`onclick="openAgentClaw('Benji', 'Monetize', '💰')" class="agent-card-hover">
              <div style="width: 40px; height: 40px; border-radius: 8px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 18px;">
                💰
              </div>
              <div>
                <h4 style="color: #fff; margin: 0; font-size: 14px; font-weight: 600;">Benji</h4>`);

html = html.replace(/onclick="openAgentClaw\('Agent', 'Role', '🤖'\)" class="agent-card-hover">\s*<div style="width: 40px; height: 40px; border-radius: 8px; background: rgba\(255,255,255,0\.05\); display: flex; align-items: center; justify-content: center; font-size: 18px;">\s*📈\s*<\/div>\s*<div>\s*<h4 style="color: #fff; margin: 0; font-size: 14px; font-weight: 600;">Fido<\/h4>/,
`onclick="openAgentClaw('Fido', 'Finance', '📈')" class="agent-card-hover">
              <div style="width: 40px; height: 40px; border-radius: 8px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 18px;">
                📈
              </div>
              <div>
                <h4 style="color: #fff; margin: 0; font-size: 14px; font-weight: 600;">Fido</h4>`);

html = html.replace(/onclick="openAgentClaw\('Agent', 'Role', '🤖'\)" class="agent-card-hover">\s*<div style="width: 40px; height: 40px; border-radius: 8px; background: rgba\(255,255,255,0\.05\); display: flex; align-items: center; justify-content: center; font-size: 18px;">\s*📊\s*<\/div>\s*<div>\s*<h4 style="color: #fff; margin: 0; font-size: 14px; font-weight: 600;">Roxy<\/h4>/,
`onclick="openAgentClaw('Roxy', 'PR', '📊')" class="agent-card-hover">
              <div style="width: 40px; height: 40px; border-radius: 8px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 18px;">
                📊
              </div>
              <div>
                <h4 style="color: #fff; margin: 0; font-size: 14px; font-weight: 600;">Roxy</h4>`);

if (!html.includes('.agent-card-hover:hover')) {
  html = html.replace('</style>', `
    .agent-card-hover:hover {
      background: rgba(255,255,255,0.08) !important;
      border-color: rgba(255,255,255,0.15) !important;
      transform: translateY(-2px);
    }
  </style>`);
}

// Add blinking cursor
if (!html.includes('@keyframes blink')) {
  html = html.replace('</style>', `
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    .blinking-cursor {
      animation: blink 1s step-end infinite;
    }
  </style>`);
}


fs.writeFileSync('artist-portal/index.html', html);
console.log('Update complete');
