import User from "../users/user.model.js";
import bcryptjs from "bcryptjs";
import { generarJWT } from "../helpers/generate-JWT.js";
import { sendConfirmationEmail } from '../helpers/email-service.js'
import crypto from "crypto";

export const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const userExist = await User.find({ email: email });

    if(userExist.length > 0){
      return res.status(500).send("Correo ya registrado");
    }

    const salt = bcryptjs.genSaltSync();
    const encryptedPassword = bcryptjs.hashSync(password, salt);
    const confirmationToken = crypto.randomBytes(20).toString('hex');

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: encryptedPassword,
      confirmationToken,
      isConfirmed: false,
    });

    await sendConfirmationEmail(email, confirmationToken, username);

    return res.status(200).json({
      msg: "Usuario registrado. Revisa tu correo para confirmar tu cuenta.",
      userDetails: {
        user: user.username,
        email: user.email,
        id: user._id,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send("No se pudo registrar el usuario");
  }
};

export const confirmToken = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ confirmationToken: token });

    if (!user) {
      return res.status(400).send({ error: 'Token inválido.' });
    }

    user.isConfirmed = true;
    user.confirmationToken = undefined;
    await user.save();

    res.send({ message: 'Cuenta confirmada con éxito.' });
  } catch (error) {
    res.status(500).send({ error: 'Error confirmando cuenta.' });
  }

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //verificar si el email existe:
    const user = await User.findOne({ email: email.toLowerCase() });

    if(user && (await bcryptjs.compare(password, user.password))){
      const token = await generarJWT(user.id, user.email)

      res.status(200).json({
        msg: "Login Ok!!!",
        userDetails: {
          user: user.username,
          email: user.email,
          id: user._id
        },
      });
    }

    if (!user) {
      return res
        .status(400)
        .send(`Wrong credentials, ${email} doesn't exists en database`);
    }

    // verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).send("wrong password");
    }

  } catch (e) {
    res.status(500).send("Comuniquese con el administrador");
  }
};
