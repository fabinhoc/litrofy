import { register } from 'register-service-worker';
import { Notify } from 'quasar';

register(import.meta.env.SERVICE_WORKER_FILE, {
  updated() {
    Notify.create({
      message: 'Nova versão disponível!',
      caption: 'Recarregue para atualizar o Litrofy.',
      color: 'primary',
      icon: 'system_update',
      timeout: 0,
      actions: [
        {
          label: 'Atualizar',
          color: 'white',
          handler: () => (location as unknown as { reload(): void }).reload(),
        },
        { label: 'Depois', color: 'grey-3' },
      ],
    });
  },

  offline() {
    Notify.create({
      message: 'Sem conexão',
      caption: 'O Litrofy está funcionando offline.',
      color: 'warning',
      icon: 'wifi_off',
      timeout: 4000,
    });
  },

  error(err) {
    console.error('Service worker error:', err);
  },
});
