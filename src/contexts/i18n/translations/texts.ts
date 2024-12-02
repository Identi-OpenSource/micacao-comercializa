import { Translations } from '../translations'

export const texts: Translations = {
  default: {
    welcome: 'Welcome',
    info: 'Information',
    error: 'Error',
    success: 'Data saved successfully',
    warning: 'Warning',
    save: 'Save',
    saveSuccess: 'The data you provided has been saved successfully.',
    saveError: 'There was an error saving the form',
    changePassword:
      'You must set a new password to continue, since it is your first login or you recently requested a password reset.',
    noConnection: 'No connection established to the internet',
    whatDoYouWantToDoToday: 'What do you want to do today?',
    logoutMsg: 'logout',
    restPassText:
      'Error al restablecer la contraseña. Puede que hayas introducido un dato incorrecto o que el código haya expirado. El mismo tiene una validez de 5 minutos.',
    resetPasswordSuccess: '¡Tu contraseña ha sido restablecida con éxito!'
  },
  ES: {
    welcome: 'Bienvenido(a)',
    info: 'Información',
    error: 'Error',
    success: 'Datos guardados con éxito',
    warning: 'Advertencia',
    save: 'Guardar',
    saveSuccess:
      'Los datos que proporcionaste han sido guardados correctamente. ',
    saveError: 'Hubo un error al guardar el formulario',
    changePassword:
      'Debes establecer una nueva contraseña para continuar, ya que es tu primer inicio de sesión o se solicitó recientemente el restablecimiento de la misma.',
    noConnection: 'No hay conexión estable a internet',
    whatDoYouWantToDoToday: '¿Qué quieres hacer hoy?',
    logoutMsg: 'Se ha cerrado la sesión',
    restPassText:
      '¡Recuperemos tu contraseña! Solicita el código de cambio de clave a tu encargado y continúa con los siguientes pasos.',
    resetPasswordError:
      'Error al restablecer la contraseña. Puede que hayas introducido un dato incorrecto o que el código haya expirado. El mismo tiene una validez de 5 minutos.',
    resetPasswordSuccess:
      '¡Tu contraseña ha sido restablecida con éxito! Ahora puedes iniciar sesión con tu nueva contraseña.'
  }
}
