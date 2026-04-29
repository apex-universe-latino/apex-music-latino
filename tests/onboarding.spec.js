const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Artist Onboarding E2E Flow', () => {
  const fakeArtists = [
    { name: 'DJ Fuego', bio: 'El rey del dembow en Miami.' },
    { name: 'Luna Pop', bio: 'Cantante de indie pop emergente.' },
    { name: 'Reggaeton Rex', bio: 'Dinosaurio del reggaeton urbano.' }
  ];

  for (const artist of fakeArtists) {
    test(`Onboarding Flow for ${artist.name}`, async ({ page }) => {
      // Create absolute path to index.html to run without a web server
      const filePath = 'file://' + path.resolve(__dirname, '../artist-portal/index.html');
      
      // Inject script to clear localStorage before loading
      await page.addInitScript(() => {
        window.localStorage.clear();
      });

      await page.goto(filePath);

      // STEP 0: Log in
      // Fill the login form
      await page.fill('#login-email', 'arcoiris');
      await page.fill('#login-password', 'arcoiris');
      await page.click('button:has-text("Acceder al Centro de Comando")');

      // The wizard uses a setTimeout of 1000ms after login.
      await page.waitForTimeout(1500);

      // STEP 1: Verify Identity Lab (EPK) is visible first
      await expect(page.locator('#wizard-title')).toContainText('Bienvenido a CUBO FRM');
      await expect(page.locator('#view-identity')).toBeVisible();

      // Fill out EPK Form
      await page.fill('input[placeholder="Nombre Artístico"]', artist.name);
      await page.fill('textarea[placeholder="Biografía (Generada por AI)"]', artist.bio);
      await page.click('button:has-text("Generar EPK con Roxy")');

      // Click "Siguiente" in the wizard overlay
      await page.click('#wizard-next');

      // STEP 2: Verify QR & Assets
      await expect(page.locator('#wizard-title')).toContainText('Genera tu Código QR');
      await expect(page.locator('#view-assets')).toBeVisible();
      // Ensure the QR image loaded
      await expect(page.locator('#view-assets img')).toBeVisible();

      // Click "Siguiente"
      await page.click('#wizard-next');

      // STEP 3: Verify Broadcast Hub
      await expect(page.locator('#wizard-title')).toContainText('Despliega tu Landing Page');
      await expect(page.locator('#view-broadcast')).toBeVisible();
      // Ensure Landing Page Generator button exists
      await expect(page.locator('button:has-text("Publicar Landing Page")')).toBeVisible();

      // Click "Siguiente"
      await page.click('#wizard-next');

      // STEP 4: Bot Activation
      await expect(page.locator('#wizard-title')).toContainText('Despierta a tus Agentes');
      
      // Click "Activar Agentes"
      await page.click('#wizard-next');

      // VERIFY WIZARD IS GONE
      await expect(page.locator('#wizard-overlay')).not.toBeVisible();
      
      // VERIFY AGENT CLAW OPENS (Benji auto-opens at the end of the wizard)
      await expect(page.locator('#agent-claw')).toHaveClass(/open/);
      
      // Click Kujo in the Meters Sidebar
      await page.click('.agent-node:has-text("Kujo")');
      
      // Wait for Context Slide animation to complete and verify Fan Rolodex is visible
      await page.waitForTimeout(400); // 300ms transition time
      await expect(page.locator('#view-frm')).toBeVisible();
      
      // Click Fido in the Meters Sidebar
      await page.click('.agent-node:has-text("Fido")');
      await page.waitForTimeout(400);
      await expect(page.locator('#view-payments')).toBeVisible();
    });
  }
});
