export interface ComplianceSection {
  title: string;
  paragraphs?: string[];
  items?: string[];
  closingParagraphs?: string[];
}

export interface ComplianceLanguageBlock {
  eyebrow: string;
  updated?: string;
  sections: ComplianceSection[];
}

export interface ComplianceDocument {
  title: string;
  description: string;
  canonicalPath: string;
  downloadHref?: string;
  blocks: ComplianceLanguageBlock[];
}

export const privacyPolicy: ComplianceDocument = {
  title: "Política de Privacidad / Privacy Policy",
  description:
    "Información sobre el tratamiento de datos personales realizado por AutentiZityWorkPlace, S.L.",
  canonicalPath: "/privacidad",
  blocks: [
    {
      eyebrow: "Versión en español",
      updated: "Última actualización 27 de julio de 2026",
      sections: [
        {
          title: "1. Responsable del tratamiento",
          paragraphs: [
            "AutentiZityWorkPlace, S.L.",
            "CIF: B88725437",
            "Domicilio: C/ Estanislao Figueras 3, 5A, 28008 Madrid, España",
            "Correo electrónico: comunidad@autentizity.org",
            "Sitio web: https://autentizity.org",
          ],
        },
        {
          title: "2. Finalidad del tratamiento",
          paragraphs: [
            "En AutentiZityWorkPlace, S.L. tratamos los datos personales que nos facilitas para atender solicitudes de contacto, gestionar relaciones profesionales o comerciales, prestar servicios de consultoría, formación, comunicación, employer branding, cultura corporativa, comunidad, impacto social y organización de eventos, así como para cumplir obligaciones legales y mejorar la seguridad y operativa de nuestros sistemas.",
          ],
        },
        {
          title: "3. Categorías de datos tratados",
          items: [
            "Datos identificativos y de contacto, como nombre, apellidos, empresa, cargo, correo electrónico y teléfono.",
            "Datos vinculados a relaciones profesionales, contractuales o de colaboración.",
            "Datos facilitados en formularios, comunicaciones o registros de eventos.",
            "Datos técnicos básicos derivados del uso del sitio web, cuando corresponda.",
          ],
        },
        {
          title: "4. Base jurídica del tratamiento",
          items: [
            "Consentimiento del interesado.",
            "Ejecución de un contrato o aplicación de medidas precontractuales.",
            "Cumplimiento de obligaciones legales.",
            "Interés legítimo para la gestión profesional, seguridad y mejora organizativa, cuando proceda.",
          ],
        },
        {
          title: "5. Destinatarios y proveedores",
          paragraphs: [
            "Tus datos podrán ser tratados por proveedores que prestan servicios necesarios para la actividad de AutentiZityWorkPlace, S.L., tales como servicios de correo y productividad (por ejemplo, Microsoft 365), hosting web y asesoría fiscal, contable o legal, cuando proceda.",
          ],
        },
        {
          title: "6. Transferencias internacionales",
          paragraphs: [
            "Cuando determinados proveedores tecnológicos traten datos fuera del Espacio Económico Europeo, se aplicarán las garantías adecuadas exigidas por la normativa aplicable, como cláusulas contractuales tipo u otros mecanismos válidos.",
          ],
        },
        {
          title: "7. Conservación",
          paragraphs: [
            "Los datos personales se conservarán durante el tiempo necesario para cumplir la finalidad para la que fueron recabados y, posteriormente, durante los plazos exigidos por la normativa aplicable o mientras puedan derivarse responsabilidades legales.",
          ],
        },
        {
          title: "8. Derechos",
          items: [
            "Acceso",
            "Rectificación",
            "Supresión",
            "Oposición",
            "Limitación del tratamiento",
            "Portabilidad, cuando resulte aplicable",
            "Retirada del consentimiento, cuando proceda",
          ],
        },
        {
          title: "9. Ejercicio de derechos y reclamaciones",
          paragraphs: [
            "Puedes ejercer tus derechos escribiendo a comunidad@autentizity.org. Asimismo, tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) si consideras que el tratamiento de tus datos no se ajusta a la normativa aplicable.",
          ],
        },
        {
          title: "10. Seguridad",
          paragraphs: [
            "AutentiZityWorkPlace, S.L. aplica medidas técnicas y organizativas razonables y proporcionadas para proteger los datos personales frente a pérdida, alteración, acceso no autorizado o tratamiento indebido.",
          ],
        },
      ],
    },
    {
      eyebrow: "English version",
      updated: "Last updated 27 July 2026",
      sections: [
        {
          title: "1. Data Controller",
          paragraphs: [
            "AutentiZityWorkPlace, S.L.",
            "Tax ID: B88725437",
            "Registered address: Spain",
            "Email: comunidad@autentizity.org",
            "Website: https://autentizity.org",
          ],
        },
        {
          title: "2. Purpose of processing",
          paragraphs: [
            "AutentiZityWorkPlace, S.L. processes personal data to respond to contact requests, manage professional or commercial relationships, deliver consulting, training, communications, employer branding, corporate culture, community, social impact and event-related services, comply with legal obligations, and improve the security and operation of its systems.",
          ],
        },
        {
          title: "3. Categories of personal data",
          items: [
            "Identification and contact data such as name, surname, company, job title, email address, and telephone number.",
            "Data relating to professional, contractual, or collaboration relationships.",
            "Data submitted through forms, communications, or event registrations.",
            "Basic technical data derived from use of the website, where applicable.",
          ],
        },
        {
          title: "4. Legal basis",
          items: [
            "Data subject consent.",
            "Performance of a contract or pre-contractual measures.",
            "Compliance with legal obligations.",
            "Legitimate interest in professional management, security, and organisational improvement, where appropriate.",
          ],
        },
        {
          title: "5. Recipients and service providers",
          paragraphs: [
            "Your data may be processed by service providers necessary for the activities of AutentiZityWorkPlace, S.L., such as email and productivity services (for example Microsoft 365), web hosting providers, and tax, accounting, or legal advisors where relevant.",
          ],
        },
        {
          title: "6. International transfers",
          paragraphs: [
            "Where certain technology providers process data outside the European Economic Area, appropriate safeguards required by applicable law will be implemented, such as Standard Contractual Clauses or other valid mechanisms.",
          ],
        },
        {
          title: "7. Retention",
          paragraphs: [
            "Personal data will be kept for as long as necessary to fulfil the purpose for which it was collected and afterwards for the periods required by applicable law or as long as legal liabilities may arise.",
          ],
        },
        {
          title: "8. Rights",
          items: [
            "Access",
            "Rectification",
            "Erasure",
            "Objection",
            "Restriction of processing",
            "Portability, where applicable",
            "Withdrawal of consent, where applicable",
          ],
        },
        {
          title: "9. Rights requests and complaints",
          paragraphs: [
            "You may exercise your rights by contacting comunidad@autentizity.org. You also have the right to lodge a complaint with the Spanish Data Protection Authority (AEPD) if you believe your data has been processed in breach of applicable law.",
          ],
        },
        {
          title: "10. Security",
          paragraphs: [
            "AutentiZityWorkPlace, S.L. implements reasonable and proportionate technical and organisational measures to protect personal data against loss, alteration, unauthorised access, or improper processing.",
          ],
        },
      ],
    },
  ],
};

export const cookiePolicy: ComplianceDocument = {
  title: "Política de Cookies / Cookie Policy",
  description:
    "Información sobre el uso de cookies técnicas, preferencias, medición y terceros en el sitio web de AutentiZity.",
  canonicalPath: "/cookies",
  blocks: [
    {
      eyebrow: "Versión en español",
      updated: "Última actualización 27 de julio de 2026",
      sections: [
        {
          title: "1. Qué son las cookies",
          paragraphs: [
            "Las cookies son pequeños archivos que se descargan en tu dispositivo al acceder a determinadas páginas web. Permiten almacenar y recuperar información sobre la navegación del usuario o de su dispositivo.",
          ],
        },
        {
          title: "2. Tipos de cookies",
          items: [
            "Cookies técnicas o estrictamente necesarias.",
            "Cookies de personalización.",
            "Cookies de análisis o medición.",
            "Cookies de terceros, cuando existan.",
          ],
        },
        {
          title: "3. Cookies utilizadas en este sitio web",
          paragraphs: [
            "Esta sección deberá completarse con el inventario real de cookies de la web. Como mínimo, debería incluir: nombre de la cookie, proveedor, finalidad, duración y tipo.",
          ],
        },
        {
          title: "4. Texto provisional si aún no se ha auditado la web",
          paragraphs: [
            "Actualmente, el sitio web utiliza cookies técnicas necesarias para el funcionamiento básico del sitio. Si en el futuro se incorporan cookies analíticas, de personalización o de terceros no exentas, se solicitará el consentimiento previo del usuario y esta política será actualizada.",
          ],
        },
        {
          title: "5. Base legal",
          paragraphs: [
            "La base legal para el uso de cookies no técnicas es el consentimiento del usuario. Las cookies técnicas o estrictamente necesarias pueden utilizarse sin consentimiento cuando resultan imprescindibles para el funcionamiento del sitio o para prestar un servicio solicitado por el usuario.",
          ],
        },
        {
          title: "6. Gestión del consentimiento",
          paragraphs: [
            "Cuando sea legalmente exigible, el usuario podrá aceptar, rechazar o configurar el uso de cookies a través del banner o panel de configuración habilitado en el sitio web.",
          ],
        },
        {
          title: "7. Desactivación y eliminación",
          paragraphs: [
            "El usuario puede permitir, bloquear o eliminar las cookies mediante la configuración de su navegador. La desactivación de determinadas cookies puede afectar al funcionamiento del sitio.",
          ],
        },
        {
          title: "8. Transferencias internacionales y actualizaciones",
          paragraphs: [
            "Si se utilizan servicios de terceros con transferencias internacionales, deberá informarse de ello junto con las garantías aplicables. Esta política podrá actualizarse cuando cambien las cookies utilizadas, la normativa o la configuración del sitio.",
          ],
        },
      ],
    },
    {
      eyebrow: "English version",
      updated: "Last updated 27 July 2026",
      sections: [
        {
          title: "1. What are cookies",
          paragraphs: [
            "Cookies are small files downloaded to your device when you access certain websites. They allow information about a user’s browsing activity or device to be stored and retrieved.",
          ],
        },
        {
          title: "2. Types of cookies",
          items: [
            "Technical or strictly necessary cookies.",
            "Preference cookies.",
            "Analytics or measurement cookies.",
            "Third-party cookies, where applicable.",
          ],
        },
        {
          title: "3. Cookies used on this website",
          paragraphs: [
            "This section should be completed with the website’s actual cookie inventory. At a minimum, it should include: cookie name, provider, purpose, duration, and type.",
          ],
        },
        {
          title: "4. Suggested interim wording if the website has not yet been audited",
          paragraphs: [
            "At present, this website uses technical cookies necessary for the basic operation of the site. If analytics, preference, or non-exempt third-party cookies are added in the future, user consent will be obtained in advance and this policy will be updated accordingly.",
          ],
        },
        {
          title: "5. Legal basis",
          paragraphs: [
            "The legal basis for the use of non-technical cookies is the user’s consent. Technical or strictly necessary cookies may be used without consent where they are essential for operation of the website or for providing a service requested by the user.",
          ],
        },
        {
          title: "6. Consent management",
          paragraphs: [
            "Where legally required, users may accept, reject, or configure cookies through the banner or settings panel available on the website.",
          ],
        },
        {
          title: "7. Disabling and deletion",
          paragraphs: [
            "Users can allow, block, or delete cookies through their browser settings. Disabling certain cookies may affect the proper functioning of the site.",
          ],
        },
        {
          title: "8. International transfers and updates",
          paragraphs: [
            "If third-party services involving international transfers are used, this must be disclosed together with the applicable safeguards. This policy may be updated whenever the cookies used, the law, or the website configuration changes.",
          ],
        },
      ],
    },
  ],
};

export const legalNotice: ComplianceDocument = {
  title: "Aviso Legal / Legal Notice",
  description:
    "Aviso legal que regula el acceso, navegación y uso del sitio web de AutentiZityWorkPlace, S.L.",
  canonicalPath: "/aviso-legal",
  blocks: [
    {
      eyebrow: "Versión en español",
      updated: "Última actualización 27 de julio de 2026",
      sections: [
        {
          title: "1. Titular del sitio web",
          paragraphs: [
            "AutentiZityWorkPlace, S.L.",
            "CIF: B88725437",
            "Domicilio social: C/ Estanislao Figueras 3, 5A, 28008 Madrid, España",
            "Correo electrónico: comunidad@autentizity.org",
            "Sitio web: https://autentizity.org",
          ],
        },
        {
          title: "2. Objeto",
          paragraphs: [
            "El presente Aviso Legal regula el acceso, navegación y uso del sitio web de AutentiZityWorkPlace, S.L.",
          ],
        },
        {
          title: "3. Condiciones de uso",
          paragraphs: [
            "El acceso y uso del sitio web atribuye la condición de usuario e implica la aceptación del presente Aviso Legal desde el momento del acceso. El usuario se compromete a utilizar el sitio web, sus contenidos y servicios de conformidad con la ley, la buena fe, el orden público y este Aviso Legal.",
          ],
        },
        {
          title: "4. Propiedad intelectual e industrial",
          paragraphs: [
            "Todos los contenidos del sitio web, incluyendo textos, imágenes, diseños, logotipos, marcas, estructura, código fuente y demás elementos, son titularidad de AutentiZityWorkPlace, S.L. o de terceros con autorización y están protegidos por la normativa aplicable.",
          ],
        },
        {
          title: "5. Responsabilidad",
          paragraphs: [
            "AutentiZityWorkPlace, S.L. no garantiza la disponibilidad continua del sitio web ni la ausencia de errores en sus contenidos, aunque adoptará medidas razonables para evitarlos o corregirlos.",
          ],
        },
        {
          title: "6. Enlaces",
          paragraphs: [
            "Este sitio web puede contener enlaces a sitios web de terceros. AutentiZityWorkPlace, S.L. no asume responsabilidad sobre los contenidos, políticas, prácticas o disponibilidad de dichos sitios externos.",
          ],
        },
        {
          title: "7. Protección de datos y cookies",
          paragraphs: [
            "El tratamiento de datos personales realizado a través de este sitio web se rige por la Política de Privacidad. El uso de cookies se regula por la Política de Cookies.",
          ],
        },
        {
          title: "8. Legislación aplicable y jurisdicción",
          paragraphs: [
            "El presente Aviso Legal se rige por la legislación española. Cualquier controversia se someterá a los juzgados y tribunales competentes conforme a la normativa aplicable.",
          ],
        },
      ],
    },
    {
      eyebrow: "English version",
      updated: "Last updated 27 July 2026",
      sections: [
        {
          title: "1. Website owner",
          paragraphs: [
            "AutentiZityWorkPlace, S.L.",
            "Tax ID: B88725437",
            "Registered address: Spain",
            "Email: comunidad@autentizity.org",
            "Website: https://autentizity.org",
          ],
        },
        {
          title: "2. Purpose",
          paragraphs: [
            "This Legal Notice governs access to, browsing of, and use of the website of AutentiZityWorkPlace, S.L.",
          ],
        },
        {
          title: "3. Terms of use",
          paragraphs: [
            "Access to and use of this website gives the user the status of user and implies acceptance of this Legal Notice from the moment of access. The user agrees to use the website, its content, and services in accordance with the law, good faith, public order, and this Legal Notice.",
          ],
        },
        {
          title: "4. Intellectual and industrial property",
          paragraphs: [
            "All website contents, including texts, images, designs, logos, trademarks, structure, source code, and other elements, are owned by AutentiZityWorkPlace, S.L. or third parties with authorisation and are protected by applicable law.",
          ],
        },
        {
          title: "5. Liability",
          paragraphs: [
            "AutentiZityWorkPlace, S.L. does not guarantee continuous availability of the website or the absence of errors in its contents, although reasonable measures will be taken to avoid or correct them.",
          ],
        },
        {
          title: "6. Links",
          paragraphs: [
            "This website may contain links to third-party websites. AutentiZityWorkPlace, S.L. accepts no responsibility for the content, policies, practices, or availability of such external sites.",
          ],
        },
        {
          title: "7. Data protection and cookies",
          paragraphs: [
            "The processing of personal data through this website is governed by the Privacy Policy. The use of cookies is governed by the Cookie Policy.",
          ],
        },
        {
          title: "8. Governing law and jurisdiction",
          paragraphs: [
            "This Legal Notice is governed by Spanish law. Any dispute arising from access to or use of the website shall be submitted to the courts and tribunals having jurisdiction under applicable law.",
          ],
        },
      ],
    },
  ],
};

export const codeOfEthics: ComplianceDocument = {
  title: "Código Ético de AutentiZity",
  description:
    "Principios éticos que guían la actividad de AutentiZityWorkPlace, S.L. y sus relaciones con clientes, colaboradores y proveedores.",
  canonicalPath: "/codigo-etico",
  downloadHref: "/documents/codigo-etico-autentizity.pdf",
  blocks: [
    {
      eyebrow: "Versión 1.0",
      updated: "Aprobado el 15 de julio de 2026 · Entrada en vigor 15 de julio de 2026 · Próxima revisión anual",
      sections: [
        {
          title: "Identificación de la organización",
          paragraphs: [
            "El presente Código Ético es aprobado por AutentiZityWorkPlace, S.L. (en adelante, AutentiZity), sociedad constituida conforme a la legislación española.",
            "Este código es de aplicación a todas las personas que forman parte de AutentiZityWorkPlace, S.L., así como a quienes actúen en representación de la organización o desarrollen actividades en su nombre.",
            "Asimismo, AutentiZity promoverá estos principios en sus relaciones con clientes, proveedores, entidades colaboradoras e instituciones, fomentando relaciones basadas en la ética, la integridad, el respeto y la transparencia.",
          ],
        },
        {
          title: "Nuestra razón de ser",
          paragraphs: [
            "En AutentiZity creemos que las organizaciones alcanzan su máximo potencial cuando las personas pueden ser auténticas, desarrollar su talento y contribuir en un entorno seguro, respetuoso e inclusivo.",
            "Nuestro compromiso es acompañar a empresas e instituciones en la construcción de culturas corporativas que sitúen a las personas en el centro, promoviendo el bienestar, la salud mental, la inclusión, la pertenencia y un liderazgo basado en la confianza.",
            "Este Código Ético establece los principios que guían nuestra forma de actuar y que esperamos compartir con nuestros clientes, aliados, proveedores y colaboradores.",
          ],
        },
        {
          title: "1. Autenticidad",
          paragraphs: [
            "Promovemos entornos donde cada persona pueda mostrarse tal y como es, sin miedo a ser juzgada, discriminada o penalizada por su identidad, circunstancias personales o forma de pensar.",
            "Fomentamos culturas donde la autenticidad sea una fortaleza y no un riesgo.",
          ],
        },
        {
          title: "2. Respeto y dignidad",
          paragraphs: ["Tratamos a todas las personas con respeto, empatía y dignidad. No toleramos ninguna forma de:"],
          items: [
            "Discriminación.",
            "Acoso.",
            "Violencia.",
            "Intimidación.",
            "Humillación.",
            "Lenguaje ofensivo o excluyente.",
          ],
        },
        {
          title: "3. Inclusión y pertenencia",
          paragraphs: [
            "Creemos que una organización verdaderamente inclusiva no se limita a incorporar talento diverso, sino que crea las condiciones para que todas las personas se sientan valoradas, escuchadas, respetadas y parte del proyecto común.",
            "Promovemos entornos de trabajo donde cada persona pueda participar plenamente, aportar su talento y desarrollarse sin tener que ocultar aspectos de su identidad o de su historia personal.",
            "Impulsamos la igualdad de oportunidades y rechazamos cualquier forma de discriminación por motivos de edad, género, identidad o expresión de género, orientación sexual, discapacidad, origen, nacionalidad, cultura, creencias, situación familiar o cualquier otra condición personal o social.",
            "Entendemos la pertenencia como el resultado de una cultura basada en el respeto, la confianza, la equidad y la autenticidad, donde todas las personas puedan ser ellas mismas y contribuir con su máximo potencial.",
          ],
        },
        {
          title: "4. Bienestar y salud mental",
          paragraphs: [
            "Consideramos la salud mental un elemento esencial del bienestar de las personas y del éxito sostenible de las organizaciones.",
            "Promovemos:",
          ],
          items: [
            "La prevención del estrés y del burnout.",
            "El equilibrio entre la vida profesional y personal.",
            "La seguridad psicológica.",
            "La escucha activa.",
            "Liderazgo inclusivo.",
            "La normalización de las conversaciones sobre salud mental.",
            "Prevención del suicidio.",
          ],
        },
        {
          title: "5. Liderazgo responsable",
          paragraphs: [
            "Entendemos el liderazgo como un ejercicio de servicio.",
            "Esperamos que quienes lideran equipos actúen con:",
          ],
          items: [
            "Ejemplaridad.",
            "Honestidad.",
            "Cercanía.",
            "Transparencia.",
            "Responsabilidad.",
            "Capacidad de escucha.",
          ],
          closingParagraphs: [
            "El liderazgo debe generar confianza, no miedo.",
            "No aceptaremos regalos, favores o invitaciones que puedan influir en nuestra independencia.",
          ],
        },
        {
          title: "6. Integridad",
          paragraphs: [
            "Actuamos con honestidad en todas nuestras relaciones. No aceptaremos actuaciones que impliquen:",
          ],
          items: [
            "Corrupción.",
            "Sobornos.",
            "Conflictos de interés no declarados.",
            "Manipulación de información.",
            "Competencia desleal.",
            "Uso indebido de información confidencial.",
          ],
          closingParagraphs: ["Nuestra reputación se basa en la confianza."],
        },
        {
          title: "7. Confidencialidad",
          paragraphs: [
            "Respetamos la privacidad de las personas y protegemos toda la información que nuestros clientes, colaboradores y participantes comparten con nosotros.",
            "Tratamos la información con responsabilidad y de acuerdo con la normativa vigente en materia de protección de datos.",
            "Nos comprometemos a cumplir en todo momento con la normativa aplicable en materia de protección de datos personales, en particular con el Reglamento (UE) 2016/679, General de Protección de Datos (RGPD), y con la Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD), así como con cualquier otra normativa que resulte de aplicación.",
          ],
        },
        {
          title: "8. Impacto social",
          paragraphs: [
            "Todas nuestras actuaciones deben generar un impacto positivo en las personas y en la sociedad.",
            "Buscamos contribuir a:",
          ],
          items: [
            "Organizaciones más humanas.",
            "Equipos más saludables.",
            "Liderazgos más inclusivos.",
            "Mayor igualdad de oportunidades.",
            "Impacto positivo en la sociedad.",
            "Entornos laborales libres de discriminación.",
          ],
          closingParagraphs: ["Medimos nuestro éxito por el cambio positivo que ayudamos a generar."],
        },
        {
          title: "9. Colaboración",
          paragraphs: [
            "Creemos en el poder de las alianzas.",
            "Trabajamos desde la cooperación con empresas, administraciones públicas, universidades, fundaciones y organizaciones sociales para acelerar el cambio cultural.",
            "La transformación se construye de manera colectiva, y creemos en la capacidad que tiene el ámbito corporativo de mejorar la sociedad desde movimientos corporativos que generan impacto social.",
          ],
        },
        {
          title: "10. Innovación con propósito",
          paragraphs: [
            "Impulsamos nuevas ideas, metodologías y soluciones siempre al servicio de las personas.",
            "La innovación solo tiene sentido cuando mejora la vida de quienes forman parte de las organizaciones.",
          ],
        },
        {
          title: "11. Canal Ético",
          paragraphs: [
            "AutentiZity pone a disposición de las personas sujetas a este Código un canal confidencial para comunicar posibles incumplimientos de la legislación o de este Código Ético.",
            "Las comunicaciones podrán realizarse de buena fe y no se adoptarán represalias contra quien comunique posibles irregularidades.",
            "Responsabilidad, asumimos las consecuencias de nuestras decisiones y aprendemos de nuestros errores.",
            "Promovemos una cultura donde la mejora continua, la transparencia y la rendición de cuentas formen parte de nuestra manera de trabajar.",
          ],
        },
        {
          title: "12. Cumplimiento de la legislación",
          paragraphs: ["Cumplimos la legislación aplicable en todos los países donde desarrollamos nuestra actividad."],
        },
        {
          title: "13. Derechos Humanos",
          paragraphs: [
            "Respetamos los Derechos Humanos internacionalmente reconocidos y rechazamos cualquier forma de trabajo infantil, trabajo forzoso, explotación laboral o vulneración de la dignidad humana.",
          ],
        },
        {
          title: "Nuestro compromiso",
          paragraphs: ["En AutentiZity nos comprometemos a:"],
          items: [
            "Actuar siempre con ética e integridad.",
            "Defender la autenticidad como un valor empresarial.",
            "Promover la inclusión, la pertenencia y el respeto hacia todas las personas.",
            "Proteger el bienestar y la salud mental.",
            "Escuchar antes de actuar.",
            "Colaborar con transparencia y profesionalidad.",
            "Generar un impacto social positivo y medible.",
          ],
        },
        {
          title: "Cierre",
          paragraphs: [
            "Invitamos a todas las organizaciones con las que colaboramos a compartir estos principios y a contribuir, desde su realidad, a construir entornos de trabajo donde las personas puedan desarrollar todo su potencial siendo ellas mismas.",
            "“Las mejores organizaciones no son aquellas donde las personas encajan; son aquellas donde las personas sienten que pertenecen porque pueden ser auténticamente quienes son.”",
            "Aprobado por Miguel Garzón, Administrador Único, AutentiZityWorkPlace, S.L.",
            "Fecha: 15 de julio de 2026",
          ],
        },
      ],
    },
  ],
};
