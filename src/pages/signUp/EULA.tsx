import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Col, Row, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const EULA = () => {
  const { t } = useTranslation();
  return (
    <div
      style={{
        position: 'absolute',
        transform: 'translate(0%, 0%)',
        width: '80vw',
        marginTop: '-20vh',
      }}
    >
      <PageTitle>{t('common.eula')}</PageTitle>
      <h1>{t('common.eula')} - Tutor</h1>
      <h2>1.Alcance del vínculo con el usuario</h2>
      <p>
        Las presentes Condiciones de uso (“Condiciones”) regulan el uso que usted (“Usuario”) hará exclusivamente desde
        la República Argentina del contenido de esta aplicación (“Tutor”) y/o de los que pudieren existir en la página
        web https://tutor-app-ps.netlify.app, (el/los “Contenido”/”Contenidos”), los cuales son puestos a disposición
        sin costo para el Usuario, y sujetos a los siguientes términos y condiciones, por TUTOR, con domicilio social en
        Ciudad de Córdoba, República Argentina (“Tutor”).
      </p>
      <p>
        <b
          style={{
            margin: 0,
          }}
        >
          POR FAVOR LEER DETENIDAMENTE ESTAS CONDICIONES ANTES DE ACCEDER O USAR LOS SERVICIOS. SE CONSIDERARÁ QUE USTED
          HA ACEPTADO LOS MISMOS POR EL USO DE ESTA APLICACIÓN Y/O EL DE LA PÁGINA WEB https://tutor-app-ps.netlify.app
        </b>
      </p>
      <p>
        Mediante el acceso que usted realiza a los Contenidos y/o al uso de los mismos, usted acuerda vincularse
        jurídicamente con TUTOR exclusivamente por estas Condiciones, las cuales no establecen ninguna relación
        contractual ni extracontractual entre usted y Tutor, quien actúa en relación a todos los Contenidos simplemente
        como una plataforma de intermediación para que usted y los cuidadores de plantas (“Tutores”) que se registren en
        el sitio https://tutor-app-ps.netlify.app (“Sitio”) o esta Aplicación, accedan a los servicios relacionados a
        plantas que se publicitan por los Tutores en el Sitio o esta Aplicación (“Servicios”), los cuales son ofertados
        por dichos Tutores, y contratados exclusivamente entre usted y ellos luego de haber evaluado ambos la
        conveniencia de concertar tal locación de Servicios. De manera que una vez que usted y los Tutores accedan a la
        información que ambos han provisto en el Sitio, y decidan eventualmente contratar entre ustedes y requerir los
        Servicios que los Tutores ofrecen, se generará una relación contractual exclusivamente entre usted y el Tutor
        que ha elegido, sin que TUTOR sea parte en tal relación, ni participe en modo alguno en el proceso de evaluación
        y eventual concertación de dicho contrato que hagan usted y el Tutor, luego de haber evaluado todo cuanto
        consideren relevante para tomar dicha decisión. Estas Condiciones sustituyen expresamente cualquier acuerdo
        previo o manifestación que usted y/o TUTOR pudiesen haberse realizado de cualquier modo relacionado al Sitio y/o
        a los Contenidos y/o a los Servicios, o por haber accedido a nuestra Plataforma. La Empresa también facilitará
        el Servicio de pago y contratación por cuenta y/o orden de los Tutores, por lo que el uso de los aplicativos
        referidos por parte de los usuarios, tampoco implicará la generación de una relación contractual con la Empresa,
        que no percibiera monto alguno por este uso ni por la prestación de este servicio a los usuarios, por lo que
        ello no generará ninguna obligación ni compromiso, ni generará ninguna garantía explícita ni implícita de la
        Empresa en favor de los usuarios. Tutor podrá modificar sin previo aviso estas Condiciones o en general dejar de
        publicar los Contenidos en el Sitio o esta Aplicación, en cualquier momento y por cualquier motivo, sin que esto
        genere daño alguno a los Usuarios. Las modificaciones serán efectivas después de la publicación por parte de
        Tutor de dichas Condiciones actualizadas en esta ubicación. Su acceso al Sitio y/o el uso de los Servicios
        después de dicha publicación, constituye su consentimiento a vincularse por las Condiciones y sus
        modificaciones. La política de Tutor frente a los datos que tanto los Usuarios como los Tutores provean al
        Sitio, será la de no compartir ninguno de tales datos con ningún tercero, salvo los que resulten estrictamente
        necesarios al Usuario o al Tutor para prestar el servicio promovido. Los Usuarios aceptan al utilizar los
        Contenidos y el Servicio y autorizan expresamente a TUTOR, a proveer al Tutor con quien el Usuario haya
        contratado, la información necesaria para la prestación del Servicio. TUTOR cumple con toda normativa vigente en
        cuanto a seguridad de datos de tarjetas de crédito, domicilio, documentación y/o demás información que tanto los
        Usuarios como los Tutores, provean a TUTOR, exclusivamente para que sean utilizados en la prestación de los
        Servicios. Con respecto a la ubicación de los Usuarios, TUTOR sólo compartirá la ubicación geográfica sin
        detalles, para mostrarse en un radio de cercanía con respecto al Usuario. TUTOR declara expresamente y el Tutor
        así lo acepta, que posterior a que el mismo decida si acepta la propuesta de Servicios que le realiza el Usuario
        en cada caso concreto, TUTOR informará al Usuario los datos requeridos para la prestación del Servicio, incluído
        el detalle de la dirección del Tutor. Asimismo TUTOR declara expresamente y el Usuario así lo acepta, que
        posterior a que el Tutor decida si acepta la propuesta de Servicios que se realice en el domicilio del Usuario
        en cada caso concreto, TUTOR informará al Tutor los datos requeridos para la prestación del Servicio, incluído
        el detalle de la dirección del Usuario. Será, en consecuencia, de exclusiva responsabilidad y decisión del Tutor
        si acepta o no prestar el Servicio en el domicilio del Usuario, y en caso que no lo haga, el Usuario declara que
        nada tendrá que reclamar al Tutor ni a TUTOR por dicha negativa.
      </p>
      <h2>2. Los Servicios</h2>
      <p>
        Los Servicios a los que se hace referencia en estas Condiciones, lo constituyen los servicios de cuidado y otros
        relativos a plantas que realizan los Tutores, a pedido y a favor de los Usuarios, que ambos (Tutores y
        Usuarios), concertan libre y voluntariamente sin la intervención de TUTOR a través de la información que ambos
        han provisto en el Sitio y/o la Aplicación. TUTOR no ha verificado la fidelidad y/o corrección y exactitud de
        ninguna información provista en el Sitio y/o la Aplicación por los Usuarios y/o los Tutores, y desde ya no se
        responsabiliza por ello ni por ningún evento que ocurra entre los Usuarios y los Tutores, previo a la
        concertación del vínculo contractual entre ellos, y/o durante la ejecución del mismo, y/o como consecuencia de
        éste.
      </p>
      <p>
        TUTOR no proporciona servicios de cuidado ni otros relacionados a plantas. TUTOR es un lugar neutral para
        Tutores que ofrecen servicios e interesados. TUTOR no es un proveedor de servicios y no brinda servicios de
        cuidado de plantas. No hacemos representaciones ni garantías sobre la calidad del cuidado de plantas u otros
        servicios proporcionados por los Tutores de servicios (“Servicios de cuidado de plantas”), o sobre sus
        interacciones y tratos con los usuarios. Los Tutores de servicios que figuran en TUTOR no están bajo la
        dirección o el control de TUTOR, y los Tutores determinan a su propia discreción cómo brindar servicios de
        cuidado de plantas u otros. TUTOR no emplea, recomienda ni respalda a los Tutores ni a los Usuarios y, en la
        medida máxima permitida por las leyes aplicables, no seremos responsables por el desempeño o la conducta de los
        Tutores o Usuarios, ya sea dentro o fuera de la aplicación. TUTOR no evalúa a los Tutores ni a los Usuarios.
        Debe tener cuidado y utilizar su criterio independiente antes de contratar a un Tutor, proporcionar Servicios o
        interactuar con los usuarios a través de TUTOR. Los Usuarios y los Tutores son los únicos responsables de tomar
        las decisiones que sean mejores para ellos y sus plantas. A los fines de ofrecer los Servicios, tanto los
        Tutores como los Usuarios crearán sendos perfiles en la Aplicación, conforme especificaciones técnicas que TUTOR
        determine en el presente y/o pueda determinar en el futuro.
      </p>
      <h3>Turnos</h3>
      <p>
        Los Usuarios y los Tutores realizan transacciones entre ellos en TUTOR cuando ambos acuerdan un
        &quot;turno&quot; que especifica las tarifas, la fecha, el tipo de servicio, los cambios de tarifa por cantidad
        de plantas y otros términos para la prestación de Servicios de cuidado de plantas u otros servicios, a través
        del mecanismo de turnos proporcionado en TUTOR. Un turno puede ser iniciado por un Usuario seleccionando un
        Servicio desde el listado proporcionado en el perfil del Tutor. Al momento de realizar la solicitud del turno,
        el Usuario detalla en la misma los datos requeridos según el Servicio. El tutor decide si acepta o no la
        solicitud. Si inicia una Solicitud, acepta pagar los Servicios de cuidado de plantas u otros servicios descritos
        en la Solicitud al hacer clic en &quot;Solicitar turno&quot;. Si es usuario y un Tutor inicia una solicitud,
        acepta pagar los servicios de cuidado de plantas u otros descritos en la solicitud, al hacer clic en
        &quot;Pagar&quot;, al permitir el Tutor, el pago del mismo. Todas las solicitudes están sujetas a la aceptación
        por parte de la parte receptora. La parte receptora no está obligada a aceptar su (o cualquier) solicitud y
        puede, a su discreción, rechazarla por cualquier motivo. Usted reconoce que, una vez que completa un turno,
        acepta cumplir con el precio y otros términos de ese Turno, como se reconoce en la confirmación de la Solicitud.
      </p>
      <h2>3. Restricciones</h2>
      <p>
        Usted, como Usuario, no podrá: (i) retirar y/o reclamar cualquier derecho de autor, marca registrada u otra nota
        de propiedad de cualquier parte de los Servicios; (ii) reproducir, modificar, preparar obras derivadas sobre los
        Servicios, distribuir, licenciar, arrendar, revender, transferir, exhibir públicamente, presentar públicamente,
        transmitir, retransmitir o explotar de otra forma los Servicios, excepto como se permita expresamente por el
        Tutor; (iii) causar o lanzar cualquier programa o script con el objeto de extraer, indexar, analizar o de otro
        modo realizar prospección de datos de cualquier parte de los Servicios o sobrecargar o bloquear indebidamente la
        operación y/o funcionalidad de cualquier aspecto de los Servicios; o (iv) intentar obtener un acceso no
        autorizado o dañar cualquier aspecto de los Servicios, o el Contenido del Sitio y/o la Aplicación.
      </p>
      <h2>4. Titularidad</h2>
      <p>
        Los Servicios y todos los derechos relativos a éstos, son y permanecerán de la propiedad de Tutor, o de quien
        éste indique. Ninguna de estas Condiciones ni su uso de los Servicios le transfieren a usted como Usuario, ni a
        los Tutores por ningún concepto, ningún derecho.
      </p>
      <h2>5. Uso de los Servicios</h2>
      <h3>a.- Cuentas de usuario.</h3>
      Con el fin de usar la mayor parte de los aspectos de los Servicios, usted debe registrarse y mantener activa una
      cuenta personal de usuario de los Servicios (“Cuenta”). Para obtener una Cuenta debe tener como mínimo 18 años. El
      registro de la cuenta le requiere que comunique a TUTOR determinada información personal, como su nombre,
      dirección, email. Usted se compromete a mantener la información en su Cuenta de forma exacta, completa y
      actualizada. Si no mantiene la información de Cuenta de forma exacta, completa y actualizada, incluso el tener un
      método de pago inválido o que haya vencido, podrá resultar en su imposibilidad para acceder y utilizar los
      Servicios. Usted es responsable de toda la actividad que ocurre en su Cuenta y se compromete a mantener en todo
      momento de forma segura y secreta el nombre de usuario y la contraseña de su Cuenta. TUTOR declara bajo juramento
      que no aplicará ningún cargo a los Tutores, ni percibirá ningún honorario de éstos con relación a los Servicios,
      limitándose a percibir una comisión pagadera exclusivamente por el Usuario.
      <h3>b.- Requisitos y conducta del usuario.</h3>
      <p>
        El Servicio no está disponible para el uso de personas menores de 18 años. Usted no podrá autorizar a terceros a
        utilizar su Cuenta. No podrá ceder o transferir de otro modo su Cuenta a cualquier otra persona o entidad. Usted
        acuerda cumplir con todas las leyes aplicables al utilizar los Servicios y solo podrá utilizar los Servicios con
        fines legítimos. En el uso de los Servicios, no causará estorbos, molestias, incomodidades o daños a la
        propiedad. En algunos casos, se le podrá requerir que facilite un documento de identidad u otro elemento de
        verificación de identidad para el acceso o uso de los Servicios, y usted acepta que se le podrá denegar el
        acceso o uso de los Servicios si se niega a facilitar el documento de identidad o el elemento de verificación de
        identidad.
      </p>
    </div>
  );
};
