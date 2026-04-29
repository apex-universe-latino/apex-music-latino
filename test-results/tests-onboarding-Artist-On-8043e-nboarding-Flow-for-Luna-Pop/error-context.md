# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/onboarding.spec.js >> Artist Onboarding E2E Flow >> Onboarding Flow for Luna Pop
- Location: tests/onboarding.spec.js:12:5

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#wizard-title')
Expected substring: "Bienvenido a CUBO FRM"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('#wizard-title')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - complementary [ref=e4]:
        - img [ref=e7]:
          - generic [ref=e8]: CUBO
          - generic [ref=e11]: FRM
        - generic [ref=e12]:
          - generic [ref=e13] [cursor=pointer]:
            - generic [ref=e14]: dashboard
            - text: Dashboard
          - generic [ref=e15] [cursor=pointer]:
            - generic [ref=e16]: groups
            - text: Fan Rolodex
            - generic [ref=e17]: "340"
          - generic [ref=e18] [cursor=pointer]:
            - generic [ref=e19]: fingerprint
            - text: Identity Lab
            - generic [ref=e20]: "28"
          - generic [ref=e21] [cursor=pointer]:
            - generic [ref=e22]: qr_code_2
            - text: QR & Assets
          - generic [ref=e23] [cursor=pointer]:
            - generic [ref=e24]: campaign
            - text: Broadcast
          - generic [ref=e25] [cursor=pointer]:
            - generic [ref=e26]: handshake
            - text: Deals
            - generic [ref=e27]: "3"
          - generic [ref=e28] [cursor=pointer]:
            - generic [ref=e29]: description
            - text: Contratos
            - generic [ref=e30]: "1"
          - generic [ref=e31] [cursor=pointer]:
            - generic [ref=e32]: smart_toy
            - text: Agentes
          - generic [ref=e33] [cursor=pointer]:
            - generic [ref=e34]: payments
            - text: Pagos
          - generic [ref=e35] [cursor=pointer]:
            - generic [ref=e36]: settings
            - text: Config
        - generic [ref=e37]:
          - paragraph [ref=e38]: AGENTES ACTIVOS
          - generic [ref=e39]:
            - generic [ref=e41]: bolt
            - generic [ref=e43]: attach_money
            - generic [ref=e45]: monitoring
            - generic [ref=e47]: trending_up
          - generic [ref=e48]:
            - generic [ref=e49]: J
            - generic [ref=e50]:
              - generic [ref=e51]: John Acevedo
              - generic [ref=e52]: Artista Pro · Apex
      - generic [ref=e53]:
        - generic [ref=e55] [cursor=pointer]: dashboard.aml
        - generic [ref=e56]:
          - generic [ref=e57]:
            - generic [ref=e58]:
              - generic [ref=e59]:
                - generic [ref=e60]:
                  - heading "Hola, Artist" [level=2] [ref=e61]
                  - generic [ref=e62]:
                    - paragraph [ref=e63]: "Panel de Control — Estado: CUBO™ Engine Activo"
                    - paragraph [ref=e65]: MARTES, 28 DE ABRIL DE 2026
                - generic [ref=e67]: 3 Chirps activos
              - generic [ref=e69]:
                - generic [ref=e70]:
                  - paragraph [ref=e71]: Total Fans
                  - paragraph [ref=e72]: —
                  - paragraph
                - generic [ref=e73]:
                  - paragraph [ref=e74]: IDs Resueltas
                  - paragraph [ref=e75]: —
                  - paragraph [ref=e76]: CUBO™ Resueltas
                - generic [ref=e77]:
                  - paragraph [ref=e78]: Revenue Semana
                  - paragraph [ref=e79]: $0
                  - paragraph
                - generic [ref=e80]:
                  - paragraph [ref=e81]: Fan Engagement
                  - paragraph [ref=e82]: —
                  - paragraph
              - generic [ref=e84]:
                - generic [ref=e85]:
                  - heading "Actividad en Tiempo Real" [level=3] [ref=e86]
                  - generic [ref=e87]:
                    - generic [ref=e88]:
                      - paragraph [ref=e91]: Maria L. participó en sorteo VIP
                      - paragraph [ref=e92]: 2m
                    - generic [ref=e93]:
                      - paragraph [ref=e96]: Carlos R. compró pack $99
                      - paragraph [ref=e97]: 8m
                    - generic [ref=e98]:
                      - paragraph [ref=e101]: Diego H. escaneó QR — Bucaramanga
                      - paragraph [ref=e102]: 15m
                    - generic [ref=e103]:
                      - paragraph [ref=e106]: Sofia M. completó perfil CUBO 360°
                      - paragraph [ref=e107]: 31m
                - generic [ref=e108]:
                  - heading "Fans por Ciudad" [level=3] [ref=e109]
                  - generic [ref=e113]: 🔄 Cargando...
                - generic [ref=e121]:
                  - paragraph [ref=e122]: 📣 Broadcast Rápido
                  - paragraph [ref=e123]: 340 fans · Email · $6.80 est.
                  - button "Crear Campaña →" [ref=e124] [cursor=pointer]
              - complementary [ref=e125]:
                - generic [ref=e126]:
                  - heading "Agentes CUBO" [level=3] [ref=e127]
                  - generic [ref=e128]: info
                - paragraph [ref=e130] [cursor=pointer]: Deals & Contratos
            - paragraph [ref=e132]: Protege tus contratos y oportunidades.
            - button "Consultar →" [ref=e133] [cursor=pointer]
          - generic [ref=e134]:
            - generic [ref=e135]:
              - generic [ref=e137]: payments
              - generic [ref=e138]:
                - paragraph [ref=e139]: Benji
                - paragraph [ref=e140]: Monetización VIP
            - paragraph [ref=e142]: Maximiza ingresos con fans de alto valor.
            - button "Consultar →" [ref=e143] [cursor=pointer]
          - paragraph [ref=e145] [cursor=pointer]: Finanzas & Royalties
        - paragraph [ref=e147]: Controla tus regalías y pagos.
        - button "Consultar →" [ref=e148] [cursor=pointer]
      - paragraph [ref=e150] [cursor=pointer]: PR & Contenido
    - paragraph [ref=e152]: Amplifica tu alcance y presencia.
    - button "Consultar →" [ref=e153] [cursor=pointer]
  - paragraph [ref=e154]: Powered by CUBO FRM™ · Apex
  - text: BROADCAST VIEW ========== -->
  - contentinfo [ref=e155]: © 2026 Apex Music Latino. All rights reserved.
  - complementary:
    - generic [ref=e156]:
      - generic [ref=e157]:
        - generic [ref=e158]: smart_toy
        - generic [ref=e159]: Apex Assistant
      - button "close" [ref=e160] [cursor=pointer]:
        - generic [ref=e161]: close
    - generic [ref=e163]:
      - text: Hola! Soy tu asistente de Apex Music. ¿En qué puedo ayudarte hoy?
      - generic:
        - text: "Prueba preguntando:"
        - text: "- \"¿Cómo actualizo mi EPK?\""
        - text: "- \"¿Dónde veo mis leads?\""
    - generic [ref=e164]:
      - generic:
        - textbox "Escribe tu duda..." [ref=e165]
        - button "send" [ref=e166] [cursor=pointer]:
          - generic [ref=e167]: send
  - generic [ref=e168]:
    - generic [ref=e169]:
      - generic [ref=e170]:
        - generic [ref=e171]: 🤖
        - generic [ref=e172]:
          - heading "Agent" [level=3] [ref=e173]
          - paragraph [ref=e174]: Role
      - button "×" [ref=e175] [cursor=pointer]
    - generic [ref=e176]:
      - heading "Agent Brain / Heartbeat" [level=4] [ref=e177]
      - generic [ref=e178]:
        - text: "> STATUS: ACTIVE"
        - text: "> MEMORY: 98% SYNCED"
        - text: "> LAST ACTION: 2m ago"
        - text: _
      - heading "Add Skills" [level=4] [ref=e179]
      - generic [ref=e180]:
        - button "+ Add new SOP" [ref=e181] [cursor=pointer]:
          - generic [ref=e182]: +
          - text: Add new SOP
        - button "+ Connect Integration" [ref=e183] [cursor=pointer]:
          - generic [ref=e184]: +
          - text: Connect Integration
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | const path = require('path');
  3  | 
  4  | test.describe('Artist Onboarding E2E Flow', () => {
  5  |   const fakeArtists = [
  6  |     { name: 'DJ Fuego', bio: 'El rey del dembow en Miami.' },
  7  |     { name: 'Luna Pop', bio: 'Cantante de indie pop emergente.' },
  8  |     { name: 'Reggaeton Rex', bio: 'Dinosaurio del reggaeton urbano.' }
  9  |   ];
  10 | 
  11 |   for (const artist of fakeArtists) {
  12 |     test(`Onboarding Flow for ${artist.name}`, async ({ page }) => {
  13 |       // Create absolute path to index.html to run without a web server
  14 |       const filePath = 'file://' + path.resolve(__dirname, '../artist-portal/index.html');
  15 |       
  16 |       // Inject script to clear localStorage before loading
  17 |       await page.addInitScript(() => {
  18 |         window.localStorage.clear();
  19 |       });
  20 | 
  21 |       await page.goto(filePath);
  22 | 
  23 |       // STEP 0: Log in
  24 |       // Fill the login form
  25 |       await page.fill('#login-email', 'arcoiris');
  26 |       await page.fill('#login-password', 'arcoiris');
  27 |       await page.click('button:has-text("Acceder al Centro de Comando")');
  28 | 
  29 |       // The wizard uses a setTimeout of 1000ms after login.
  30 |       await page.waitForTimeout(1500);
  31 | 
  32 |       // STEP 1: Verify Identity Lab (EPK) is visible first
> 33 |       await expect(page.locator('#wizard-title')).toContainText('Bienvenido a CUBO FRM');
     |                                                   ^ Error: expect(locator).toContainText(expected) failed
  34 |       await expect(page.locator('#view-identity')).toBeVisible();
  35 | 
  36 |       // Fill out EPK Form
  37 |       await page.fill('input[placeholder="Nombre Artístico"]', artist.name);
  38 |       await page.fill('textarea[placeholder="Biografía (Generada por AI)"]', artist.bio);
  39 |       await page.click('button:has-text("Generar EPK con Roxy")');
  40 | 
  41 |       // Click "Siguiente" in the wizard overlay
  42 |       await page.click('#wizard-next');
  43 | 
  44 |       // STEP 2: Verify QR & Assets
  45 |       await expect(page.locator('#wizard-title')).toContainText('Genera tu Código QR');
  46 |       await expect(page.locator('#view-assets')).toBeVisible();
  47 |       // Ensure the QR image loaded
  48 |       await expect(page.locator('#view-assets img')).toBeVisible();
  49 | 
  50 |       // Click "Siguiente"
  51 |       await page.click('#wizard-next');
  52 | 
  53 |       // STEP 3: Verify Broadcast Hub
  54 |       await expect(page.locator('#wizard-title')).toContainText('Despliega tu Landing Page');
  55 |       await expect(page.locator('#view-broadcast')).toBeVisible();
  56 |       // Ensure Landing Page Generator button exists
  57 |       await expect(page.locator('button:has-text("Publicar Landing Page")')).toBeVisible();
  58 | 
  59 |       // Click "Siguiente"
  60 |       await page.click('#wizard-next');
  61 | 
  62 |       // STEP 4: Bot Activation
  63 |       await expect(page.locator('#wizard-title')).toContainText('Despierta a tus Agentes');
  64 |       
  65 |       // Click "Activar Agentes"
  66 |       await page.click('#wizard-next');
  67 | 
  68 |       // VERIFY WIZARD IS GONE
  69 |       await expect(page.locator('#wizard-overlay')).not.toBeVisible();
  70 |       
  71 |       // VERIFY AGENT CLAW OPENS (Benji auto-opens at the end of the wizard)
  72 |       await expect(page.locator('#agent-claw')).toHaveClass(/open/);
  73 |       
  74 |       // Click Kujo in the Meters Sidebar
  75 |       await page.click('.agent-node:has-text("Kujo")');
  76 |       
  77 |       // Wait for Context Slide animation to complete and verify Fan Rolodex is visible
  78 |       await page.waitForTimeout(400); // 300ms transition time
  79 |       await expect(page.locator('#view-frm')).toBeVisible();
  80 |       
  81 |       // Click Fido in the Meters Sidebar
  82 |       await page.click('.agent-node:has-text("Fido")');
  83 |       await page.waitForTimeout(400);
  84 |       await expect(page.locator('#view-payments')).toBeVisible();
  85 |     });
  86 |   }
  87 | });
  88 | 
```