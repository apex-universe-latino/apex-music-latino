/**
 * CUBO ENGINE (OPENCLAW) — NUCLEUS v1.0
 * The core "Embedded Software" for the Apex Artist Ecosystem.
 * Manages 1-5 bots, API Juice meters, and Skill deployments.
 */

const CUBO = {
    config: {
        artistId: null,
        plan: 'Pro', // 'Freemium', 'Pro', 'Enterprise'
        botCount: 1,
        tokens: { used: 450, total: 1000 }, // Mock initial data
        skills: [
            { id: 'scraping', name: 'Market Discovery', status: 'active', usage: 45 },
            { id: 'outreach', name: 'Cold Outreach', status: 'active', usage: 80 },
            { id: 'chat', name: 'Superfan Chat', status: 'premium', usage: 0 }
        ]
    },

    init: function(artistSlug) {
        this.config.artistId = artistSlug;
        console.log(`[CUBO] Nucleus initialized for ${artistSlug}`);
        this.renderOverlay();
    },

    renderOverlay: function() {
        // Build the Floating Nucleus Action Button
        const fab = document.createElement('div');
        fab.id = 'cubo-launcher';
        fab.className = 'fixed bottom-8 right-8 z-[1000] cursor-pointer group';
        fab.innerHTML = `
            <div class="relative">
                <div class="w-16 h-16 rounded-full bg-gradient-to-br from-tango-accent to-black flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-110 border border-white/20">
                    <span class="material-symbols-outlined text-white text-3xl animate-pulse">monitoring</span>
                </div>
                <div class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-[#131313] flex items-center justify-center">
                    <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
            </div>
        `;
        
        fab.onclick = () => this.toggleDashboard();
        document.body.appendChild(fab);

        // Build the Dashboard Panel
        const panel = document.createElement('div');
        panel.id = 'cubo-dashboard';
        panel.className = 'fixed bottom-28 right-8 w-96 max-w-[90vw] glass-panel rounded-3xl border border-white/10 shadow-2xl z-[999] opacity-0 pointer-events-none translate-y-8 transition-all duration-500 overflow-hidden';
        panel.innerHTML = `
            <div class="p-6 border-b border-white/5 bg-gradient-to-r from-tango-accent/20 to-transparent">
                <div class="flex justify-between items-center mb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-tango-accent flex items-center justify-center">
                            <span class="material-symbols-outlined text-white text-lg">data_usage</span>
                        </div>
                        <h3 class="font-headline font-bold text-white uppercase tracking-widest text-sm">CUBO Intelligence</h3>
                    </div>
                    <span class="px-2 py-1 rounded bg-green-500/20 text-green-500 text-[10px] font-bold uppercase tracking-tighter">Live Engine</span>
                </div>
                
                <!-- API JUICE METER -->
                <div class="space-y-2">
                    <div class="flex justify-between text-[10px] uppercase font-bold text-zinc-500">
                        <span>API Juice (Tokens)</span>
                        <span id="cubo-juice-percent">45% Remaining</span>
                    </div>
                    <div class="w-full h-3 bg-zinc-900 rounded-full overflow-hidden border border-white/5 p-0.5">
                        <div id="cubo-juice-bar" class="h-full bg-gradient-to-r from-tango-accent to-[#ff4444] rounded-full transition-all duration-1000" style="width: 45%;"></div>
                    </div>
                </div>
            </div>

            <div class="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <!-- Bot Selector (1-5 logic) -->
                <div>
                    <label class="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-3">Active Clones (Bots)</label>
                    <div class="flex gap-2" id="bot-grid">
                        <!-- Bots injected here -->
                    </div>
                </div>

                <!-- Skill Usage -->
                <div class="space-y-3">
                    <label class="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block">Skill Deployment</label>
                    <div id="skill-list" class="space-y-2">
                        <!-- Skills injected here -->
                    </div>
                </div>
            </div>

            <div class="p-4 bg-black/40 border-t border-white/5 text-center">
                <button class="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 text-[10px] font-bold uppercase tracking-widest transition-all">
                    Upgrade to Enterprise
                </button>
            </div>
        `;
        document.body.appendChild(panel);
        this.renderBots();
        this.renderSkills();
    },

    toggleDashboard: function() {
        const panel = document.getElementById('cubo-dashboard');
        const isHidden = panel.classList.contains('opacity-0');
        if (isHidden) {
            panel.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-8');
            panel.classList.add('opacity-100', 'translate-y-0');
        } else {
            panel.classList.add('opacity-0', 'pointer-events-none', 'translate-y-8');
            panel.classList.remove('opacity-100', 'translate-y-0');
        }
    },

    renderBots: function() {
        const grid = document.getElementById('bot-grid');
        const bots = ['Kujo', 'Benji', 'Fido', 'Roxy', 'Shadow'];
        grid.innerHTML = bots.map((name, i) => `
            <div class="flex-1 text-center group/bot cursor-pointer">
                <div class="aspect-square rounded-xl bg-zinc-900 border ${i < this.config.botCount ? 'border-tango-accent' : 'border-white/5 opacity-30'} flex items-center justify-center mb-1 group-hover/bot:bg-tango-accent/10 transition-all">
                    <span class="material-symbols-outlined text-[20px] ${i < this.config.botCount ? 'text-tango-accent' : 'text-zinc-600'}">smart_toy</span>
                </div>
                <div class="text-[8px] uppercase tracking-tighter ${i < this.config.botCount ? 'text-white' : 'text-zinc-700'}">${name}</div>
            </div>
        `).join('');
    },

    renderSkills: function() {
        const list = document.getElementById('skill-list');
        list.innerHTML = this.config.skills.map(skill => `
            <div class="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div class="flex items-center gap-3">
                    <div class="w-2 h-2 rounded-full ${skill.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-900'}"></div>
                    <div>
                        <div class="text-[10px] font-bold text-white uppercase">${skill.name}</div>
                        <div class="text-[8px] text-zinc-500">${skill.status}</div>
                    </div>
                </div>
                <div class="text-[10px] font-headline text-tango-accent font-bold">${skill.usage}%</div>
            </div>
        `).join('');
    }
};

// Auto-init for standalone artist pages
document.addEventListener('DOMContentLoaded', () => {
    const slug = document.documentElement.getAttribute('data-artist') || 'arcoiris';
    CUBO.init(slug);
});
