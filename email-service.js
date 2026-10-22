/**
 * Servicio de Envío de Correos Transaccionales (EmailJS)
 * Gloria Palace Amadores
 */
(function (window) {
  'use strict';

  // =========================================================================
  // CONFIGURACIÓN DE EMAILJS
  // Sustituye estos valores con los de tu cuenta gratuita en https://www.emailjs.com
  // =========================================================================
  var CONFIG = {
    PUBLIC_KEY: 'TU_PUBLIC_KEY',        // Account > General > Public Key
    SERVICE_ID: 'TU_SERVICE_ID',        // Email Services > Service ID (ej. service_gmail)
    TEMPLATES: {
      BIENVENIDA: 'TU_TEMPLATE_REGISTRO',  // Email Templates > Template ID
      RESERVA: 'TU_TEMPLATE_RESERVA',      // Email Templates > Template ID
      BAJA: 'TU_TEMPLATE_BAJA'             // Email Templates > Template ID
    }
  };

  var inicializado = false;

  function init() {
    if (inicializado) return;
    if (window.emailjs && CONFIG.PUBLIC_KEY && CONFIG.PUBLIC_KEY !== 'TU_PUBLIC_KEY') {
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

    // Verificación amigable para desarrollo si aún no se han configurado las claves
    if (!window.emailjs || CONFIG.PUBLIC_KEY === 'TU_PUBLIC_KEY' || templateId.startsWith('TU_')) {
      console.info(
        '%c[EMAIL SIMULADO - PENDIENTE CREDENCIALES EMAILJS]%c\n' +
        'Plantilla: ' + templateId + '\n' +
        'Destinatario: ' + (params.to_email || params.email || 'desconocido') + '\n' +
        'Datos:',
        'background:#0C3E50;color:#fff;padding:2px 6px;border-radius:4px;font-weight:bold;',
        '',
        params
      );
      return Promise.resolve({ status: 200, text: 'Modo demo (sin claves configuradas)' });
    }

    return window.emailjs.send(CONFIG.SERVICE_ID, templateId, params)
      .then(function (response) {
        console.log('[EMAIL ENVIADO CON ÉXITO]', response.status, response.text);
        return response;
      })
      .catch(function (error) {
        console.error('[EMAIL ERROR]', error);
        // Retornamos sin relanzar para no romper la experiencia del usuario
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
    },

    // 3. Caso de uso: Baja / Cancelación
    enviarBaja: function (datos) {
      // datos: { correo, motivo }
      return enviar(CONFIG.TEMPLATES.BAJA, {
        to_email: datos.correo,
        email_usuario: datos.correo,
        motivo_baja: datos.motivo || 'No especificado',
        fecha_baja: new Date().toLocaleDateString('es-ES')
      });
    }
  };

})(window);
