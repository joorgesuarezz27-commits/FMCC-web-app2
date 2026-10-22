/**
 * Servicio de Envío de Correos Transaccionales (EmailJS)
 * Gloria Palace Amadores
 */
(function (window) {
  'use strict';

  // =========================================================================
  // CONFIGURACIÓN DE EMAILJS (Credenciales de producción)
  // =========================================================================
  var CONFIG = {
    PUBLIC_KEY: 'SIDUwr7Nts_RT1Fqe',
    SERVICE_ID: 'service_gloria',
    TEMPLATES: {
      BIENVENIDA: 'template_74k109e',
      RESERVA: 'template_7dhfdcp'
    }
  };

  var inicializado = false;

  function init() {
    if (inicializado) return;
    if (window.emailjs && CONFIG.PUBLIC_KEY) {
      window.emailjs.init({ publicKey: CONFIG.PUBLIC_KEY });
      inicializado = true;
    }
  }

  /**
   * Envía un email transaccional usando EmailJS de forma segura y no bloqueante
   * @param {string} templateId 
   * @param {Object} params 
   */
  function enviar(templateId, params) {
    init();

    if (!window.emailjs || !CONFIG.PUBLIC_KEY || !templateId) {
      console.warn('[EMAIL] Servicio no disponible o plantilla no definida.');
      return Promise.resolve(null);
    }

    return window.emailjs.send(CONFIG.SERVICE_ID, templateId, params)
      .then(function (response) {
        console.log('[EMAIL ENVIADO CON ÉXITO]', response.status, response.text);
        return response;
      })
      .catch(function (error) {
        console.error('[EMAIL ERROR]', error);
        return null;
      });
  }

  // API pública del servicio
  window.EmailService = {
    config: CONFIG,

    // 1. Caso de uso: Registro de nuevo usuario
    enviarBienvenida: function (datos) {
      // datos: { usuario, correo }
      return enviar(CONFIG.TEMPLATES.BIENVENIDA, {
        to_name: datos.usuario,
        to_email: datos.correo,
        nombre_usuario: datos.usuario,
        correo_usuario: datos.correo,
        fecha: new Date().toLocaleDateString('es-ES')
      });
    },

    // 2. Caso de uso: Comprobación o reserva
    enviarReserva: function (datos) {
      // datos: { idReserva, correo, entrada, salida, habitacion, regimen, huespedes, total }
      return enviar(CONFIG.TEMPLATES.RESERVA, {
        to_email: datos.correo,
        id_reserva: datos.idReserva,
        fecha_entrada: datos.entrada,
        fecha_salida: datos.salida,
        tipo_habitacion: datos.habitacion,
        tipo_regimen: datos.regimen,
        num_huespedes: datos.huespedes,
        precio_total: datos.total
      });
    }
  };

})(window);
