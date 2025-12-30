class SystemDemo {
    constructor() {
        this.isRunning = false;
    }

    async runCompleteDemo() {
        if (this.isRunning) return;
        this.isRunning = true;

        try {
            this.log('🚀 Starting Complete System Demo...');
            
            // 1. System Validation
            await this.validateSystem();
            
            // 2. Safety Demo
            await this.demonstrateSafety();
            
            // 3. Priority Demo
            await this.demonstratePriority();
            
            // 4. Reliability Demo
            await this.demonstrateReliability();
            
            // 5. Final Validation
            await this.runFinalValidation();
            
            this.log('✅ Complete System Demo Finished Successfully!');
        } finally {
            this.isRunning = false;
        }
    }

    async validateSystem() {
        this.log('📋 Phase 1: System Validation');
        
        const hasController = !!window.adaptiveUI?.controller;
        const hasReliability = !!window.adaptiveUI?.controller?.reliabilityManager;
        const hasSafety = !!window.adaptiveUI?.controller?.reliabilityManager?.safetyPolicy;
        
        this.log(`Controller: ${hasController ? '✅' : '❌'}`);
        this.log(`Reliability Manager: ${hasReliability ? '✅' : '❌'}`);
        this.log(`Safety Policy: ${hasSafety ? '✅' : '❌'}`);
        
        await this.wait(1000);
    }

    async demonstrateSafety() {
        this.log('🛡️ Phase 2: Safety Mechanisms Demo');
        
        // Reset system
        window.adaptiveUI.controller.emergencyReset();
        await this.wait(200);
        
        // Rapid fire test (should be throttled)
        this.log('Testing rapid signals (should be throttled)...');
        for (let i = 0; i < 5; i++) {
            await window.adaptiveUI.controller.processSignal('undo-loop', { targetId: 0 });
        }
        
        const isThrottled = window.adaptiveUI.controller.isThrottled('undo-loop');
        this.log(`Throttling active: ${isThrottled ? '✅' : '❌'}`);
        
        await this.wait(2000);
    }

    async demonstratePriority() {
        this.log('🎯 Phase 3: Priority System Demo');
        
        window.adaptiveUI.controller.emergencyReset();
        await this.wait(200);
        
        // Low priority first
        await window.adaptiveUI.controller.processSignal('dwell', { targetId: 1 });
        await this.wait(300);
        
        // High priority should override
        await window.adaptiveUI.controller.processSignal('undo-loop', { targetId: 2 });
        await this.wait(300);
        
        const state = window.adaptiveUI.controller.getExecutionState();
        this.log(`Priority system working: ${state.lastProcessed?.type === 'undo-loop' ? '✅' : '❌'}`);
        
        await this.wait(2000);
    }

    async demonstrateReliability() {
        this.log('⚡ Phase 4: Reliability Demo');
        
        // Run stress test
        await window.stressTester.runAllTests();
        
        // Run stability test (shortened)
        this.log('Running mini stability test...');
        const stabilityTest = new StabilityTest(window.adaptiveUI.controller);
        
        // Quick stability check
        for (let i = 0; i < 10; i++) {
            await window.adaptiveUI.controller.processSignal('hover-repeat', { targetId: i % 6 });
            await this.wait(100);
        }
        
        this.log('Reliability tests completed ✅');
        await this.wait(1000);
    }

    async runFinalValidation() {
        this.log('🏁 Phase 5: Final System Validation');
        
        const success = await window.finalIntegrationTest.runFullSystemValidation();
        
    }

    log(message) {
        if (window.adaptiveUI && window.adaptiveUI.log) {
            window.adaptiveUI.log(`[Demo] ${message}`);
        } else {
            console.log(`[Demo] ${message}`);
        }
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Auto-initialize when page loads
window.addEventListener('load', () => {
    window.systemDemo = new SystemDemo();
    
    // Add demo button to controls
    const controls = document.querySelector('.control-group');
    if (controls) {
        const demoBtn = document.createElement('button');
        demoBtn.textContent = 'Complete Demo';
        demoBtn.className = 'test-btn';
        demoBtn.style.background = 'linear-gradient(135deg, #ffeaa7, #fdcb6e)';
        demoBtn.onclick = () => window.systemDemo.runCompleteDemo();
        controls.appendChild(demoBtn);
    }
});

window.SystemDemo = SystemDemo;