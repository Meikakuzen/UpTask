import nodemailer from 'nodemailer'

export const emailRegistro = async(datos)=>{
    const {email, nombre, token} = datos;

    const transport = nodemailer.createTransport({
        host: process.env.HOST_SMTP,
        port: process.env.PORT_SMTP,
        auth: {
          user: process.env.USER_SMTP,
          pass: process.env.PASS_SMTP
        }
      });

      //información del email

      const info = await transport.sendMail({
        from:"UpTask -  Administrador de Proyectos",
        to: email,
        subject: "UpTask - Comprueba tu cuenta",
        text: "Comprueba tu cuenta en UpTask",
        html:` <p>Hola, ${nombre}. Comprueba tu cuenta en UpTask</p>
        <p>Tu cuenta ya esta casi lista. Sólo debes comprobarla en el siguiente enlace</p>
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
        <p>Si tu no creaste esta cuenta puedes eliminar este mensaje </p>
        `

      })
    }    

    export const emailOlvidePassword = async(datos)=>{
      const {email, nombre, token} = datos;
  
      const transport = nodemailer.createTransport({
          host: process.env.HOST_SMTP,
          port: process.env.PORT_SMTP,
          auth: {
            user: process.env.USER_SMTP,
            pass: process.env.PASS_SMTP
          }
        });
  
        //información del email
        const info = await transport.sendMail({
          from:"UpTask -  Administrador de Proyectos",
          to: email,
          subject: "UpTask - Reestablece tu password",
          text: "Reestablece tu password en UpTask",
          html:` <p>Hola, ${nombre}. Has solicitado resetear tu password</p>
          <p>Sigue el siguiente enlace para reestablecer tu password</p>
          <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer password</a>
          <p>Si este mensaje no es para ti puedes eliminarlo </p>
          `
  
        })
      }    
  
  