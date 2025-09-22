import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

const UiPreset = definePreset(Aura, {
    semantic: {
        colorScheme: {
            light: {
                primary: {
                    color: '{sky.500}',
                    inverseColor: '#ffffff',
                    hoverColor: '{sky.500}',
                    activeColor: '{sky.600}',
                },
                highlight: {
                    background: '{sky.200}',
                    focusBackground: '{sky.300}',
                    color: '{sky.950}',
                    focusColor: '{sky.950}'
                },
                surface: {
                    0: '#ffffff',
                    50: '{slate.50}',
                    100: '{slate.100}'
                },
            },
            dark: {
                primary: {
                    color: '{sky.300}',
                    inverseColor: '{sky.950}',
                    hoverColor: '{sky.200}',
                    activeColor: '{sky.100}'
                },
                highlight: {
                    background: '{sky.700}',
                    focusBackground: '{sky.600}',
                    color: '#ffffff',
                    focusColor: '#ffffff'
                },
                surface: {
                    0: '{soho.900}',
                    50: '{soho.800}',
                    100: '{soho.700}'
                },
            }
        }
    },
    options: {
        cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng'
        }
    },
    components: {
        button: {
            colorScheme: {
                light: {
                    outlined: {
                        primary: {
                            borderColor: '{sky.500}',
                            hoverBackground: '{sky.100}'
                        }
                    }
                },
                dark: {
                    outlined: {
                        primary: {
                            borderColor: '{sky.300}',
                            hoverBackground: '{sky.900}'
                        }
                    }
                }
            }
        }
    }
});

export default UiPreset;