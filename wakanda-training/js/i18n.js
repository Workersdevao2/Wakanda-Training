/**
 * Wakanda Training, PT / EN i18n
 * Toggle is in the header (outside hamburger). Preference saved in localStorage.
 */
(function () {
  const STORAGE_KEY = 'wakanda_lang';
  const DEFAULT_LANG = 'pt';

  const translations = {
    /* ---------- Nav ---------- */
    'nav.home': { pt: 'Início', en: 'Home' },
    'nav.about': { pt: 'Sobre Nós', en: 'About' },
    'nav.modalities': { pt: 'Modalidades', en: 'Programs' },
    'nav.projects': { pt: 'Projetos', en: 'Projects' },
    'nav.schedule': { pt: 'Horários', en: 'Schedule' },
    'nav.pricing': { pt: 'Preçário', en: 'Pricing' },
    'nav.shop': { pt: 'Loja', en: 'Shop' },
    'nav.events': { pt: 'Eventos', en: 'Events' },
    'nav.results': { pt: 'Resultados', en: 'Results' },
    'nav.enroll': { pt: 'Inscrição', en: 'Join' },
    'nav.contact': { pt: 'Contacto', en: 'Contact' },

    /* ---------- Common / footer ---------- */
    'footer.nav': { pt: 'Navegação', en: 'Navigate' },
    'footer.contact': { pt: 'Contacto', en: 'Contact' },
    'footer.rights': { pt: '© 2026 Wakanda Training. Todos os direitos reservados.', en: '© 2026 Wakanda Training. All rights reserved.' },
    'footer.tagline': { pt: 'Mais que treino, um estilo de vida.', en: 'More than training. A lifestyle.' },
    'footer.address': {
      pt: 'Benfica, Rua Direita do BFA<br>Defronte ao Condomínio Ville Vermont<br>Luanda, Angola',
      en: 'Benfica, Rua Direita do BFA<br>Opposite Ville Vermont Condo<br>Luanda, Angola'
    },
    'aria.menu': { pt: 'Menu', en: 'Menu' },
    'aria.cart': { pt: 'Carrinho', en: 'Cart' },
    'aria.lang': { pt: 'Mudar idioma', en: 'Change language' },

    /* ---------- Home ---------- */
    'home.tag': { pt: 'High Performance • Luanda', en: 'High Performance • Luanda' },
    'home.h1': { pt: 'Mais que treino.<br>Um estilo de vida.', en: 'More than training.<br>A lifestyle.' },
    'home.lead': {
      pt: 'Ginásio high performance em Benfica, Luanda. CrossFit, Hyrox, Musculação, Kickboxing, Zumba e o Gordus Project. Disciplina, comunidade e resultados reais.',
      en: 'High-performance gym in Benfica, Luanda. CrossFit, Hyrox, Strength, Kickboxing, Zumba and the Gordus Project. Discipline, community and real results.'
    },
    'home.cta.trial': { pt: 'Aula Experimental Grátis', en: 'Free Trial Class' },
    'home.cta.gordus': { pt: 'Ver Gordus Project', en: 'See Gordus Project' },
    'home.gordus.tag': { pt: 'Campanha activa', en: 'Active campaign' },
    'home.gordus.h2': { pt: 'Gordus Project', en: 'Gordus Project' },
    'home.gordus.lead': {
      pt: 'A tua transformação começa agora. 6 meses, 4 grupos, uma missão.',
      en: 'Your transformation starts now. 6 months, 4 groups, one mission.'
    },
    'home.gordus.body': {
      pt: 'Liderado pelo Coach Wilson Benjamim. Treino presencial, online e outdoor · Nutrição · Mentalidade.',
      en: 'Led by Coach Wilson Benjamim. In-person, online and outdoor training · Nutrition · Mindset.'
    },
    'home.gordus.offer': { pt: 'Operação Dezembro 90 Plus', en: 'Operation December 90 Plus' },
    'home.gordus.dates': { pt: '21 Set → 21 Dez 2026 · 120.000 KZ', en: '21 Sep → 21 Dec 2026 · 120,000 KZ' },
    'home.gordus.offerBody': {
      pt: 'Treino + Nutrição + Mentalidade. Programa online, corrida às quartas, aula aos sábados. <strong style="color: var(--text);">Bónus:</strong> Quadras Festivas (Dez–Jan) gratuito.',
      en: 'Training + Nutrition + Mindset. Online program, Wednesday runs, Saturday group class. <strong style="color: var(--text);">Bonus:</strong> Holiday season program (Dec–Jan) free.'
    },
    'home.gordus.join': { pt: 'Inscreve-te agora', en: 'Join now' },
    'home.gordus.more': { pt: 'Conhecer o Projeto', en: 'Learn more' },
    'home.mod.h2': { pt: 'Modalidades', en: 'Programs' },
    'home.mod.lead': { pt: 'Escolhe o teu caminho. Nós acompanhamos a evolução.', en: 'Choose your path. We guide the progress.' },
    'home.mod.all': { pt: 'Ver todas as modalidades', en: 'View all programs' },
    'home.community.h2': { pt: 'Mais que treino. É comunidade.', en: 'More than training. It’s community.' },
    'home.community.lead': {
      pt: 'Pessoas reais, objetivos reais e uma energia que te faz evoluir. Ambiente acolhedor para todos os níveis.',
      en: 'Real people, real goals and energy that pushes you forward. A welcoming space for every level.'
    },
    'home.community.cta': { pt: 'Junta-te a nós', en: 'Join us' },

    /* ---------- About ---------- */
    'about.h1': { pt: 'Sobre a Wakanda Training', en: 'About Wakanda Training' },
    'about.lead': {
      pt: 'Mais que um ginásio. Uma comunidade de superação.',
      en: 'More than a gym. A community built on progress.'
    },
    'about.team': { pt: 'A nossa equipa', en: 'Our team' },
    'about.team.lead': {
      pt: 'Coaches dedicados a acompanhar a tua evolução todos os dias.',
      en: 'Coaches dedicated to your progress every day.'
    },

    /* ---------- Modalities ---------- */
    'mod.h1': { pt: 'Modalidades', en: 'Programs' },
    'mod.lead': { pt: 'CrossFit, Hyrox, Kickboxing, Zumba e mais em Benfica, Luanda. Escolhe o teu caminho — nós acompanhamos a evolução.', en: 'CrossFit, Hyrox, Kickboxing, Zumba and more in Benfica, Luanda. Choose your path — we guide the progress.' },
    'mod.more': { pt: 'Saber mais', en: 'Learn more' },
    'mod.book': { pt: 'Reservar vaga', en: 'Book a spot' },
    'mod.q.h2': { pt: 'Tens uma pergunta?', en: 'Have a question?' },
    'mod.q.lead': {
      pt: 'Preços, horários, nível, aula experimental: envia no WhatsApp com os detalhes certos.',
      en: 'Pricing, schedule, level, trial class: send on WhatsApp with the right details.'
    },
    'mod.start.h2': { pt: 'Não sabes por onde começar?', en: 'Not sure where to start?' },
    'mod.start.cta': { pt: 'Aula experimental grátis', en: 'Free trial class' },

    /* ---------- Projects ---------- */
    'proj.h1': { pt: 'Projetos de Transformação', en: 'Transformation Projects' },
    'proj.lead': {
      pt: 'Programas pensados para mudar o corpo e a mentalidade.',
      en: 'Programs designed to change body and mindset.'
    },
    'proj.featured': { pt: 'Em destaque', en: 'Featured' },
    'proj.join': { pt: 'Inscreve-te agora', en: 'Join now' },

    /* ---------- Schedule ---------- */
    'sch.h1': { pt: 'Horários', en: 'Schedule' },
    'sch.lead': {
      pt: 'Horários de aulas em Luanda (Benfica). Escolhe o melhor slot e confirma no WhatsApp.',
      en: 'Class schedule in Luanda (Benfica). Pick the best slot and confirm on WhatsApp.'
    },
    'sch.note': {
      pt: 'Horários sujeitos a alteração. Confirma sempre no WhatsApp.',
      en: 'Times may change. Always confirm on WhatsApp.'
    },
    'sch.highlights': { pt: 'Destaques', en: 'Highlights' },
    'sch.try.h2': { pt: 'Queres experimentar?', en: 'Want to try?' },
    'sch.try.lead': {
      pt: 'Aula experimental gratuita. Escolhe o horário que te der mais jeito.',
      en: 'Free trial class. Choose a time that works for you.'
    },
    'sch.try.cta': { pt: 'Agendar agora', en: 'Book now' },

    /* ---------- Pricing ---------- */
    'price.h1': { pt: 'Preçário', en: 'Pricing' },
    'price.lead': {
      pt: 'Aulas de grupo e treino personalizado. Transparência total.',
      en: 'Group classes and personal training. Full transparency.'
    },
    'price.group': { pt: 'Aulas de grupo', en: 'Group classes' },
    'price.pt': { pt: 'Treino personalizado', en: 'Personal training' },
    'price.pay': { pt: 'Pagamento', en: 'Payment' },
    'price.cta': { pt: 'Pronto para começar?', en: 'Ready to start?' },
    'price.ask': { pt: 'Pedir preçário no WhatsApp', en: 'Ask for pricing on WhatsApp' },

    /* ---------- Shop ---------- */
    'shop.h1': { pt: 'Loja Oficial', en: 'Official Shop' },
    'shop.lead': { pt: 'Veste a tribo. Treina com o equipamento certo.', en: 'Wear the tribe. Train with the right gear.' },
    'shop.add': { pt: 'Adicionar', en: 'Add to cart' },
    'shop.cart': { pt: 'Carrinho', en: 'Cart' },
    'shop.checkout': { pt: 'Enviar pedido no WhatsApp', en: 'Send order on WhatsApp' },
    'shop.empty': { pt: 'O carrinho está vazio.', en: 'Your cart is empty.' },
    'shop.total': { pt: 'Total', en: 'Total' },

    /* ---------- Events ---------- */
    'ev.h1': { pt: 'Eventos', en: 'Events' },
    'ev.lead': {
      pt: 'A comunidade não para. Desafios, festas e momentos que marcam.',
      en: 'The community never stops. Challenges, parties and moments that matter.'
    },

    /* ---------- Results ---------- */
    'res.h1': { pt: 'Resultados & Transformações', en: 'Results & Transformations' },
    'res.lead': {
      pt: 'Histórias reais. Pessoas reais. Resultados reais.',
      en: 'Real stories. Real people. Real results.'
    },

    /* ---------- Enroll ---------- */
    'enroll.h1': { pt: 'Inscrição', en: 'Join' },
    'enroll.lead': {
      pt: 'Queremos treinar contigo. Preenche e envia no WhatsApp.',
      en: 'We want to train with you. Fill in and send on WhatsApp.'
    },
    'enroll.form.h2': { pt: 'Pedido de inscrição', en: 'Enrollment request' },
    'enroll.form.lead': {
      pt: 'Preenche os dados. No WhatsApp envias a mensagem e, em seguida, anexas o bilhete e a foto.',
      en: 'Fill in your details. On WhatsApp you send the message, then attach your ID and photo.'
    },
    'enroll.name': { pt: 'Nome completo *', en: 'Full name *' },
    'enroll.phone': { pt: 'Telefone / WhatsApp *', en: 'Phone / WhatsApp *' },
    'enroll.email': { pt: 'Email (opcional)', en: 'Email (optional)' },
    'enroll.age': { pt: 'Idade', en: 'Age' },
    'enroll.height': { pt: 'Altura e peso', en: 'Height and weight' },
    'enroll.type': { pt: 'Quero inscrever-me em *', en: 'I want to join *' },
    'enroll.detail': { pt: 'Modalidade / evento *', en: 'Program / event *' },
    'enroll.payment': { pt: 'Método de pagamento preferido (opcional)', en: 'Preferred payment method (optional)' },
    'enroll.address': { pt: 'Morada / zona (opcional)', en: 'Address / area (optional)' },
    'enroll.time': { pt: 'Horário preferido (opcional)', en: 'Preferred time (optional)' },
    'enroll.msg': { pt: 'Objectivos / mensagem (opcional)', en: 'Goals / message (optional)' },
    'enroll.docs.title': {
      pt: 'Para concluir no WhatsApp, anexa também:',
      en: 'To complete on WhatsApp, also attach:'
    },
    'enroll.docs.id': { pt: 'Bilhete de identidade', en: 'ID document' },
    'enroll.docs.id.hint': { pt: '(PDF ou foto legível)', en: '(PDF or clear photo)' },
    'enroll.docs.photo': { pt: 'Foto meio corpo', en: 'Half-body photo' },
    'enroll.docs.photo.hint': { pt: '(tipo passe ou selfie)', en: '(passport-style or selfie)' },
    'enroll.docs.relative': { pt: 'WhatsApp de um parente', en: 'A relative’s WhatsApp' },
    'enroll.docs.social': { pt: 'Instagram e TikTok', en: 'Instagram and TikTok' },
    'enroll.docs.social.hint': { pt: '(se tiveres)', en: '(if you have them)' },
    'enroll.docs.bonus': { pt: 'Bónus: 3 amigos dos arredores', en: 'Bonus: 3 friends nearby' },
    'enroll.submit': { pt: 'Enviar inscrição no WhatsApp', en: 'Send enrollment on WhatsApp' },
    'enroll.note': {
      pt: 'Abre o WhatsApp com a mensagem pronta. Envia o texto e, na mesma conversa, anexa o bilhete e a foto.',
      en: 'Opens WhatsApp with the message ready. Send the text, then attach your ID and photo in the same chat.'
    },

    'enroll.opt.mod': { pt: 'Modalidade (aulas / packs)', en: 'Program (classes / packs)' },
    'enroll.opt.re': { pt: 'Reinscrição (10.000 AKZ)', en: 'Re-enrollment (10.000 AKZ)' },
    'enroll.opt.gordus': { pt: 'Gordus Project 90 Plus', en: 'Gordus Project 90 Plus' },
    'enroll.opt.event': { pt: 'Evento', en: 'Event' },
    'enroll.opt.trial': { pt: 'Aula experimental', en: 'Trial class' },
    'enroll.mod.label': { pt: 'Modalidade de interesse', en: 'Program of interest' },
    'enroll.mod.label.req': { pt: 'Modalidade *', en: 'Program *' },
    'enroll.mod.all': { pt: 'Todas — acesso do pack de grupo', en: 'All — group pack access' },
    'enroll.mod.hint': {
      pt: 'No pack de grupo podes treinar várias modalidades. Indica a principal se quiseres.',
      en: 'A group pack includes several classes. Pick a main one if you want.'
    },
    'enroll.evt.label': { pt: 'Evento *', en: 'Event *' },
    'enroll.trial.label': { pt: 'Quero experimentar *', en: 'I want to try *' },
    'enroll.trial.unsure': { pt: 'Ainda não sei', en: 'Not sure yet' },
    'enroll.plan.label': { pt: 'Tipo de plano *', en: 'Plan type *' },
    'enroll.plan.group': { pt: 'Aulas de grupo', en: 'Group classes' },
    'enroll.plan.pt': { pt: 'Treino personalizado (PT)', en: 'Personal training (PT)' },
    'enroll.plan.drop': { pt: 'Aula ou sessão avulsa', en: 'Drop-in class or session' },
    'enroll.plan.unsure': { pt: 'Ainda não sei — quero aconselhar-me', en: 'Not sure — I want advice' },
    'enroll.pack.group': { pt: 'Pack de grupo (frequência) *', en: 'Group pack (frequency) *' },
    'enroll.pack.pt': { pt: 'Pack de treino personalizado *', en: 'Personal training pack *' },
    'enroll.pack.drop': { pt: 'Aula ou sessão avulsa *', en: 'Drop-in class or session *' },
    'enroll.pack.pick': { pt: 'Selecciona o pack...', en: 'Select a pack...' },
    'enroll.pack.group.hint': {
      pt: 'Validade 30 dias · inscrição à parte (20.000 AKZ)',
      en: 'Valid 30 days · enrollment fee separate (20.000 AKZ)'
    },
    'enroll.pack.pt.hint': {
      pt: 'Sessões de 1 hora · validade 30 dias · inscrição à parte (20.000 AKZ)',
      en: '1-hour sessions · valid 30 days · enrollment fee separate (20.000 AKZ)'
    },
    'enroll.fee.check': {
      pt: 'Sou novo no ginásio — a taxa de inscrição é 20.000 AKZ (além do pack).',
      en: 'I am new to the gym — the enrollment fee is 20.000 AKZ (on top of the pack).'
    },
    'enroll.fee.hint': {
      pt: 'Se já fores membro activo, deixa desmarcado. Reinscrição usa o tipo “Reinscrição” (10.000 AKZ).',
      en: 'If you are already an active member, leave unchecked. Returning members use “Re-enrollment” (10.000 AKZ).'
    },
    'enroll.docs.member.title': {
      pt: 'Para concluir no WhatsApp, anexa também:',
      en: 'To finish on WhatsApp, also send:'
    },
    'enroll.docs.re.title': {
      pt: 'Para a reinscrição no WhatsApp:',
      en: 'For re-enrollment on WhatsApp:'
    },
    'enroll.docs.re.1': { pt: 'Confirma que queres voltar (taxa 10.000 AKZ)', en: 'Confirm you want to return (fee 10.000 AKZ)' },
    'enroll.docs.re.2': { pt: 'Indica o pack que queres retomar (opcional)', en: 'Say which pack you want to resume (optional)' },
    'enroll.docs.re.3': { pt: 'Comprovativo de pagamento da reinscrição', en: 'Proof of payment for re-enrollment' },
    'enroll.docs.gordus.title': {
      pt: 'Para concluir o Gordus no WhatsApp, anexa também:',
      en: 'To finish Gordus on WhatsApp, also send:'
    },
    'enroll.docs.gordus.photo': { pt: 'Foto meio corpo (antes do desafio)', en: 'Half-body photo (before the challenge)' },
    'enroll.docs.event.title': {
      pt: 'No WhatsApp confirma também:',
      en: 'On WhatsApp also confirm:'
    },
    'enroll.docs.event.1': { pt: 'Que evento queres e quantas pessoas', en: 'Which event and how many people' },
    'enroll.docs.event.2': { pt: 'Comprovativo de pagamento (quando aplicável)', en: 'Proof of payment (when applicable)' },
    'enroll.docs.trial.title': {
      pt: 'Para a aula experimental:',
      en: 'For the trial class:'
    },
    'enroll.docs.trial.1': { pt: 'Não precisas de documentos agora', en: 'No documents needed now' },
    'enroll.docs.trial.2': { pt: 'Confirma no WhatsApp o dia e a hora', en: 'Confirm day and time on WhatsApp' },
    'enroll.docs.trial.3': { pt: 'Leva roupa de treino e água', en: 'Bring training clothes and water' },
    'enroll.docs.default.title': { pt: 'Depois de enviar:', en: 'After you send:' },
    'enroll.docs.default.1': {
      pt: 'Escolhe acima em que te queres inscrever',
      en: 'Choose above what you want to join'
    },
    'enroll.docs.default.2': {
      pt: 'A lista do que anexar no WhatsApp actualiza-se automaticamente',
      en: 'The WhatsApp attachment list updates automatically'
    },
    'enroll.popular': { pt: 'Mais popular', en: 'Most popular' },
    'enroll.best': { pt: 'Melhor valor', en: 'Best value' },
    'enroll.full': { pt: 'Acesso total', en: 'Full access' },
    'enroll.member': { pt: 'membro', en: 'member' },
    'enroll.visitor': { pt: 'visitante', en: 'visitor' },

    'enroll.info.h2': { pt: 'Só queres informação?', en: 'Just looking for info?' },
    'enroll.info.lead': {
      pt: 'Para preços, horários ou dúvidas sobre uma modalidade ou evento, usa os formulários nas páginas Modalidades e Eventos.',
      en: 'For prices, schedules or questions about a program or event, use the forms on Programs and Events.'
    },
    'enroll.info.mod': { pt: 'Perguntar sobre modalidades', en: 'Ask about programs' },
    'enroll.info.ev': { pt: 'Perguntar sobre eventos', en: 'Ask about events' },
    'enroll.info.price': { pt: 'Ver preçário', en: 'View pricing' },

    /* ---------- Contact ---------- */
    'contact.h1': { pt: 'Contacto', en: 'Contact' },
    'contact.lead': {
      pt: 'Wakanda Training em Benfica, Rua Direita do BFA (defronte Ville Vermont), Luanda. Fala connosco no WhatsApp.',
      en: 'Wakanda Training in Benfica, Rua Direita do BFA (opposite Ville Vermont), Luanda. Reach us on WhatsApp.'
    },
    'contact.talk': { pt: 'Fala connosco', en: 'Talk to us' },
    'contact.talk.lead': {
      pt: 'Preferimos WhatsApp para respostas rápidas. Podes agendar aula experimental, pedir informações sobre o Gordus Project ou qualquer modalidade.',
      en: 'We prefer WhatsApp for fast replies. Book a trial class or ask about Gordus Project or any program.'
    },
    'contact.wa': { pt: 'Agendar via WhatsApp', en: 'Book via WhatsApp' },
    'contact.location': { pt: 'Localização', en: 'Location' },
    'contact.maps': { pt: 'Abrir no Google Maps', en: 'Open in Google Maps' },
    'contact.space': { pt: 'O nosso espaço', en: 'Our space' },
    'contact.banks': { pt: 'Contas bancárias', en: 'Bank accounts' },
    'contact.banks.lead': {
      pt: 'Corpos Malhados Prestação de Serviço, Lda · Envia sempre o comprovativo no WhatsApp',
      en: 'Corpos Malhados Prestação de Serviço, Lda · Always send the receipt on WhatsApp'
    },
    'contact.quick': { pt: 'Mensagens rápidas', en: 'Quick messages' },
    'contact.quick.lead': {
      pt: 'Clica e a conversa no WhatsApp já começa com o texto certo.',
      en: 'Tap and WhatsApp opens with the right message ready.'
    },

    /* ---------- Form shared ---------- */
    'form.name': { pt: 'Nome *', en: 'Name *' },
    'form.phone': { pt: 'Telefone / WhatsApp *', en: 'Phone / WhatsApp *' },
    'form.message': { pt: 'Mensagem (opcional)', en: 'Message (optional)' },
    'form.send': { pt: 'Enviar no WhatsApp', en: 'Send on WhatsApp' },
    'form.select': { pt: 'Selecciona...', en: 'Select...' },

    /* ---------- About body ---------- */
    'about.story.h2': { pt: 'A nossa história', en: 'Our story' },
    'about.story.p1': {
      pt: 'A Wakanda Training nasceu da paixão pelo high performance e da vontade de criar um espaço onde qualquer pessoa, independentemente do nível, possa evoluir com disciplina, acompanhamento real e uma comunidade que apoia.',
      en: 'Wakanda Training was born from a passion for high performance and the drive to build a space where anyone, at any level, can grow with discipline, real coaching and a supportive community.'
    },
    'about.story.p2': {
      pt: 'Com 6 anos de existência e a experiência de 15 anos do Coach Wilson Benjamim no mundo fitness, transformámos um armazém industrial em Luanda num verdadeiro templo de treino.',
      en: 'With 6 years of history and Coach Wilson Benjamim’s 15 years in fitness, we turned an industrial warehouse in Luanda into a true training temple.'
    },
    'about.story.p3': {
      pt: 'Aqui não se trata apenas de números na balança ou de carga na barra. Trata-se de construir hábitos, recuperar autoestima e viver com mais energia.',
      en: 'Here it’s not only about scale numbers or load on the bar. It’s about building habits, reclaiming confidence and living with more energy.'
    },
    'about.values.h2': { pt: 'O que nos move', en: 'What drives us' },
    'about.v.discipline': { pt: 'Disciplina', en: 'Discipline' },
    'about.v.discipline.p': {
      pt: 'Resultados vêm de consistência, não de motivação passageira.',
      en: 'Results come from consistency, not fleeting motivation.'
    },
    'about.v.community': { pt: 'Comunidade', en: 'Community' },
    'about.v.community.p': {
      pt: 'Treinas ao lado de pessoas reais com objetivos reais. Ninguém fica para trás.',
      en: 'You train next to real people with real goals. No one is left behind.'
    },
    'about.v.overcome': { pt: 'Superação', en: 'Growth' },
    'about.v.overcome.p': {
      pt: 'O desafio não é contra quem treina ao teu lado. É contra aquilo que ontem te impediu de avançar.',
      en: 'The challenge isn’t the person next to you. It’s whatever stopped you yesterday.'
    },
    'about.v.health': { pt: 'Saúde integral', en: 'Full health' },
    'about.v.health.p': {
      pt: 'Físico, mental e emocional. Apoiamos a pessoa completa.',
      en: 'Physical, mental and emotional. We support the whole person.'
    },
    'about.team.h2': { pt: 'A nossa equipa', en: 'Our team' },
    'about.team.lead': {
      pt: 'Coaches dedicados a acompanhar a tua evolução todos os dias.',
      en: 'Coaches dedicated to your progress every day.'
    },
    'about.team.note': {
      pt: 'Nomes e especialidades podem ser atualizados com os dados oficiais da equipa.',
      en: 'Names and specialties can be updated with the official team details.'
    },
    'about.space.h2': { pt: 'O espaço', en: 'The space' },
    'about.space.lead': {
      pt: 'Um armazém transformado em high performance.',
      en: 'A warehouse turned into high performance.'
    },
    'about.space.p': {
      pt: 'Localizado na Rua do BFA, defronte ao Condomínio Ville Vermont, o nosso espaço mantém a identidade industrial: estrutura metálica, ambiente autêntico e energia pura de treino. Equipamentos completos para CrossFit, Hyrox, Musculação, Kickboxing e muito mais.',
      en: 'On Rua do BFA, opposite Ville Vermont Condo, our space keeps its industrial identity: steel structure, authentic atmosphere and pure training energy. Full equipment for CrossFit, Hyrox, strength, Kickboxing and more.'
    },
    'about.space.maps': { pt: 'Ver localização no Maps', en: 'View location on Maps' },
    'about.cta.h2': { pt: 'Vem viver a experiência', en: 'Come live the experience' },
    'about.cta.p': {
      pt: 'Aula experimental gratuita. Sem compromisso. Só a vontade de começar.',
      en: 'Free trial class. No commitment. Just the will to start.'
    },
    'about.cta.btn': { pt: 'Agendar aula experimental', en: 'Book a trial class' },

    /* ---------- Modalities body ---------- */
    'mod.crossfit.p': {
      pt: 'Força, resistência e performance. Programação completa, dinâmica e desafiante, respeitando a progressão de cada atleta. Foco em Operação Dezembro.',
      en: 'Strength, endurance and performance. Complete, dynamic programming that respects each athlete’s progress. Focus on Operation December.'
    },
    'mod.musc.p': {
      pt: 'Estrutura completa, equipamentos de qualidade, acompanhamento profissional e plano estruturado para todos os níveis. Força, técnica e evolução.',
      en: 'Full structure, quality equipment, professional coaching and structured plans for every level. Strength, technique and progress.'
    },
    'mod.kick.p': {
      pt: 'Técnica, controlo e disciplina. Melhora a condição física, ganha confiança e desenvolve velocidade.',
      en: 'Technique, control and discipline. Build fitness, confidence and speed.'
    },
    'mod.zumba.p': {
      pt: 'Energia, ritmo e bem-estar. Segundas, quartas e sextas às 19h00.',
      en: 'Energy, rhythm and wellbeing. Mondays, Wednesdays and Fridays at 19:00.'
    },
    'mod.kids.p': {
      pt: 'Coordenação motora, força, equilíbrio, disciplina, confiança e espírito de equipa. Atividades dinâmicas e adaptadas à idade.',
      en: 'Motor skills, strength, balance, discipline, confidence and teamwork. Dynamic, age-adapted activities.'
    },
    'mod.bjj.p': {
      pt: 'Arte, disciplina e vida. Mais do que um desporto.',
      en: 'Art, discipline and life. More than a sport.'
    },
    'mod.judo.p': {
      pt: 'Técnica, equilíbrio e disciplina. Para crianças e adultos.',
      en: 'Technique, balance and discipline. For kids and adults.'
    },
    'mod.enroll': { pt: 'Inscrever-me', en: 'Join' },
    'mod.musc': { pt: 'Musculação', en: 'Strength training' },

    /* ---------- Pricing body ---------- */
    'price.group.h2': { pt: 'Aulas de grupo', en: 'Group classes' },
    'price.group.lead': {
      pt: 'Packs mensais · frequência semanal · validade 30 dias · aulas não acumuláveis',
      en: 'Monthly packs · weekly frequency · 30-day validity · classes not rollover'
    },
    'price.enroll': { pt: 'Inscrição', en: 'Enrollment' },
    'price.enroll.note': { pt: 'Renovável após 90 dias', en: 'Renewable after 90 days' },
    'price.reenroll': { pt: 'Reinscrição', en: 'Re-enrollment' },
    'price.reenroll.note': { pt: 'Após período de inatividade', en: 'After a period of inactivity' },
    'price.drop.in': { pt: 'Aula avulsa (interno)', en: 'Drop-in (member)' },
    'price.drop.in.note': { pt: 'Atleta inscrito no ginásio', en: 'Registered gym athlete' },
    'price.drop.out': { pt: 'Aula avulsa (externo)', en: 'Drop-in (visitor)' },
    'price.drop.out.note': { pt: 'Atleta visitante', en: 'Visiting athlete' },
    'price.freq': { pt: 'Frequência', en: 'Frequency' },
    'price.validity': { pt: 'Validade', en: 'Validity' },
    'price.value': { pt: 'Valor', en: 'Price' },
    'price.popular': { pt: 'Mais popular', en: 'Most popular' },
    'price.full': { pt: 'Acesso total', en: 'Full access' },
    'price.best': { pt: 'Melhor valor', en: 'Best value' },
    'price.access': {
      pt: 'Acesso a todas as aulas:',
      en: 'Access to all classes:'
    },
    'price.hours': {
      pt: 'Funcionamento: Seg–Sex 05h00–21h30 · Sáb–Dom 07h00–18h00 · Mensalidade até dia 5 de cada mês.',
      en: 'Hours: Mon–Fri 05:00–21:30 · Sat–Sun 07:00–18:00 · Membership due by the 5th of each month.'
    },
    'price.pt.h2': { pt: 'Treino personalizado', en: 'Personal training' },
    'price.pt.lead': {
      pt: 'Sessões individuais com treinador · validade 30 dias',
      en: '1-on-1 sessions with a coach · 30-day validity'
    },
    'price.pt.session': { pt: 'Sessão avulsa', en: 'Single session' },
    'price.pt.session.note': { pt: 'Interno · Externo (1 hora)', en: 'Member · Visitor (1 hour)' },
    'price.sessions': { pt: 'Sessões / mês', en: 'Sessions / month' },
    'price.pay.h2': { pt: 'Pagamento', en: 'Payment' },
    'price.pay.lead': {
      pt: 'Transferência ou Multicaixa Express · envia o comprovativo no WhatsApp',
      en: 'Bank transfer or Multicaixa Express · send the receipt on WhatsApp'
    },
    'price.pay.note': {
      pt: 'Actualizações de pagamento levam até 48h. Quem tiver a mensalidade expirada não poderá treinar até regularizar.',
      en: 'Payment updates can take up to 48h. Expired memberships cannot train until settled.'
    },
    'price.holder': { pt: 'Titular', en: 'Account holder' },
    'price.ready.h2': { pt: 'Pronto para começar?', en: 'Ready to start?' },
    'price.ready.p': {
      pt: 'Formaliza a inscrição ou fala connosco no WhatsApp.',
      en: 'Complete enrollment or message us on WhatsApp.'
    },

    /* ---------- Schedule body ---------- */
    'sch.cf.h2': { pt: 'CrossFit & Hyrox', en: 'CrossFit & Hyrox' },
    'sch.cf.lead': { pt: 'Actualizado · Head Coach Wilson Benjamim', en: 'Updated · Head Coach Wilson Benjamim' },
    'sch.weekdays': { pt: 'Segunda a Sexta', en: 'Monday to Friday' },
    'sch.weekend': { pt: 'Sábados e Feriados', en: 'Saturdays & holidays' },
    'sch.other': { pt: 'Outras modalidades', en: 'Other programs' },
    'sch.hours.note': {
      pt: 'Horário de funcionamento: Seg–Sex 5h00–21h30 · Sáb/Dom 7h00–13h00.',
      en: 'Opening hours: Mon–Fri 5:00–21:30 · Sat/Sun 7:00–13:00.'
    },

    /* ---------- Contact body ---------- */
    'contact.talk.p': {
      pt: 'Preferimos WhatsApp para respostas rápidas. Podes agendar aula experimental, pedir informações sobre o Gordus Project ou qualquer modalidade.',
      en: 'We prefer WhatsApp for fast replies. Book a trial class or ask about Gordus Project or any program.'
    },
    'contact.space.p': {
      pt: 'O espaço é um armazém industrial adaptado, um ambiente autêntico de high performance.',
      en: 'The space is a converted industrial warehouse: authentic high-performance energy.'
    },
    'contact.phone': { pt: 'Telefone / WhatsApp', en: 'Phone / WhatsApp' },
    'contact.email': { pt: 'Email', en: 'Email' },
    'contact.social': { pt: 'Redes', en: 'Social' },
    'contact.express': { pt: 'Nº Express / Transferência rápida', en: 'Express / fast transfer number' },
    'contact.paypay.p': {
      pt: 'Pede o QR no WhatsApp para pagar.',
      en: 'Ask for the QR on WhatsApp to pay.'
    },
    'contact.quick.p': {
      pt: 'Clica e a conversa no WhatsApp já começa com o texto certo.',
      en: 'Tap and WhatsApp opens with the right message ready.'
    },

    /* ---------- Shop body ---------- */
    'shop.apparel': { pt: 'Vestuário', en: 'Apparel' },
    'shop.accessories': { pt: 'Acessórios de Treino', en: 'Training accessories' },
    'shop.cart.title': { pt: 'O teu carrinho', en: 'Your cart' },
    'shop.cart.view': { pt: 'Ver carrinho', en: 'View cart' },
    'shop.size': { pt: 'Tamanho', en: 'Size' },
    'shop.qty': { pt: 'Qtd', en: 'Qty' },

    /* ---------- Shared CTAs ---------- */
    'cta.enroll': { pt: 'Inscrever-me', en: 'Join' },
    'cta.whatsapp': { pt: 'WhatsApp', en: 'WhatsApp' },
    'cta.learn': { pt: 'Saber mais', en: 'Learn more' },
    'cta.book': { pt: 'Reservar vaga', en: 'Book a spot' },
    'cta.trial': { pt: 'Aula experimental grátis', en: 'Free trial class' },

    /* ---------- Projects / events / results short ---------- */
    'proj.included': { pt: 'O que está incluído', en: "What's included" },
    'proj.invest': { pt: 'Investimento', en: 'Investment' },
    'proj.payment': { pt: 'Pagamento único • Vagas limitadas', en: 'One-time payment • Limited spots' },
    'ev.upcoming': { pt: 'Próximos e recentes', en: 'Upcoming & recent' },
    'ev.ask.h2': { pt: 'Pergunta ou reserva', en: 'Ask or book' },
    'ev.miss.h2': { pt: 'Não percas nada', en: "Don't miss out" },
    'res.share.h2': { pt: 'Partilha a tua evolução', en: 'Share your progress' },
    'res.next.h2': { pt: 'A tua história pode ser a próxima', en: 'Your story could be next' },


    /* ---------- Days / schedule labels ---------- */

    /* ---------- Polish pass ---------- */
    'home.mod.kids': { pt: 'Coordenação e espírito de equipa', en: 'Coordination and teamwork' },
    'contact.banks.lead2': {
      pt: 'Corpos Malhados Prestação de Serviços, Lda · envia comprovativo no WhatsApp',
      en: 'Corpos Malhados Prestação de Serviços, Lda · send the receipt on WhatsApp'
    },
    'contact.quick.trial': { pt: 'Aula Experimental', en: 'Trial class' },
    'ev.hero.note': {
      pt: 'Atualizamos constantemente. Segue o Instagram ou pergunta no WhatsApp para a agenda mais recente.',
      en: 'We update often. Follow Instagram or ask on WhatsApp for the latest schedule.'
    },
    'ev.gordus.p': {
      pt: 'Operação Dezembro. 90 dias de transformação com acompanhamento completo + bónus das quadras festivas.',
      en: 'Operation December. 90 days of transformation with full support + holiday-season bonus.'
    },
    'ev.zumba.p': {
      pt: 'Vem zumbar com a energia da Wakanda. Música, convívio e movimento. Vagas limitadas.',
      en: 'Come dance with Wakanda energy. Music, community and movement. Limited spots.'
    },
    'ev.notify': { pt: 'Quero ser avisado', en: 'Notify me' },
    'ev.form.lead': {
      pt: 'Datas, vagas, reservas ou o que levar: envia no WhatsApp com o contexto certo.',
      en: 'Dates, spots, bookings or what to bring: send on WhatsApp with the right context.'
    },
    'ev.form.subject': { pt: 'O que queres fazer? *', en: 'What do you want to do? *' },
    'ev.form.send': { pt: 'Enviar no WhatsApp', en: 'Send on WhatsApp' },
    'ev.miss.p': {
      pt: 'Segue o Instagram ou formaliza a inscrição quando estiveres pronto.',
      en: 'Follow Instagram or complete enrollment when you are ready.'
    },
    'ev.miss.cta': { pt: 'Quero inscrever-me', en: 'I want to join' },
    'sch.th.time': { pt: 'Horário', en: 'Time' },
    'sch.th.duration': { pt: 'Duração', en: 'Duration' },
    'sch.cta.enroll': { pt: 'Inscrever-me', en: 'Join' },
    'sch.cta.trial': { pt: 'Aula experimental', en: 'Trial class' },
    'enroll.form.h2': { pt: 'Pedido de inscrição', en: 'Enrollment request' },
    'enroll.aside': {
      pt: 'Treino com acompanhamento real. Escolhe a modalidade e confirma a vaga no WhatsApp.',
      en: 'Training with real coaching. Choose a program and confirm your spot on WhatsApp.'
    },
    'enroll.info.h2': { pt: 'Só queres informação?', en: 'Just looking for info?' },
    'enroll.info.mod': { pt: 'Perguntar sobre modalidades', en: 'Ask about programs' },
    'enroll.info.ev': { pt: 'Perguntar sobre eventos', en: 'Ask about events' },
    'shop.acc.lead': {
      pt: 'Bandas, gloves, ligaduras e cordas para elevar o teu treino.',
      en: 'Bands, gloves, wraps and ropes to level up your training.'
    },
    'shop.checkout': { pt: 'Enviar encomenda via WhatsApp', en: 'Send order via WhatsApp' },
    'mod.form.subject': { pt: 'O que queres saber? *', en: 'What do you want to know? *' },
    'mod.form.note': { pt: 'Para te inscreveres de vez, usa a página', en: 'To enroll for good, use the' },
    'mod.form.send': { pt: 'Enviar pergunta no WhatsApp', en: 'Send question on WhatsApp' },
    'mod.start.h2': { pt: 'Não sabes por onde começar?', en: 'Not sure where to start?' },
    'mod.start.p': {
      pt: 'Agenda uma aula experimental gratuita ou formaliza a inscrição.',
      en: 'Book a free trial class or complete enrollment.'
    },
    'mod.start.enroll': { pt: 'Quero inscrever-me', en: 'I want to join' },
    'mod.start.trial': { pt: 'Aula experimental', en: 'Trial class' },
    'proj.dates': { pt: 'Operação Dezembro • 21 Set → 21 Dez 2026', en: 'Operation December • 21 Sep → 21 Dec 2026' },
    'proj.inc1': { pt: '✓ Programa online com aulas', en: '✓ Online program with classes' },
    'proj.inc2': { pt: '✓ Corrida todas as quartas', en: '✓ Run every Wednesday' },
    'proj.inc3': { pt: '✓ Aula em grupo aos sábados', en: '✓ Group class on Saturdays' },
    'proj.inc4': { pt: '✓ Acompanhamento durante os 90 dias', en: '✓ Support throughout the 90 days' },
    'proj.inc5': { pt: '✓ Bónus: Programa Especial Quadras Festivas (Dez–Jan) GRATUITO', en: '✓ Bonus: Holiday program (Dec–Jan) FREE' },
    'proj.full.lead': { pt: 'A jornada completa de transformação.', en: 'The full transformation journey.' },
    'proj.phase2': { pt: 'Fase 2: Transformação (Meses 3-4)', en: 'Phase 2: Transformation (Months 3-4)' },
    'proj.prize': {
      pt: 'Após 6 meses de disciplina: 1 milhão de Kwanzas para o homem e 1 milhão para a mulher com melhores resultados.',
      en: 'After 6 months of discipline: 1 million Kwanzas for the top man and 1 million for the top woman.'
    },
    'proj.criteria': {
      pt: 'Critérios: Carisma, empenho, motivação, resiliência e resultados.',
      en: 'Criteria: Charisma, effort, motivation, resilience and results.'
    },
    'proj.not.only': { pt: 'Não é apenas emagrecimento', en: 'It’s not only weight loss' },
    'proj.start': { pt: 'Começar a minha transformação', en: 'Start my transformation' },
    'res.real.h2': { pt: 'Transformações reais', en: 'Real transformations' },
    'res.real.p': {
      pt: 'Não publicamos números vazios. Publicamos perseverança, disciplina e mudança de vida.',
      en: 'We don’t post empty numbers. We share perseverance, discipline and life change.'
    },
    'res.more': { pt: 'Ver mais histórias', en: 'See more stories' },
    'res.share.p': {
      pt: 'Treinas connosco e tens resultados para mostrar? Fala connosco. A comunidade inspira-se em ti.',
      en: 'Train with us and have results to show? Tell us. The community draws inspiration from you.'
    },
    'res.share.cta': { pt: 'Partilhar a minha história', en: 'Share my story' },
    'form.message': { pt: 'Mensagem (opcional)', en: 'Message (optional)' },
    'form.select': { pt: 'Selecciona...', en: 'Select...' },


    'ev.desafios.p': {
      pt: 'Workouts “For Time”, desafios de consistência e competições amigáveis dentro da box. Mantém a evolução e a motivação em alta.',
      en: '“For Time” workouts, consistency challenges and friendly box competitions. Keep progress and motivation high.'
    },
    'ev.workshops.p': {
      pt: 'Dias temáticos, workshops de técnica, celebrações da comunidade e momentos de superação. Fica atento às redes e ao WhatsApp.',
      en: 'Theme days, technique workshops, community celebrations and breakthrough moments. Watch social media and WhatsApp.'
    },
    'ev.desafios.h3': { pt: 'Desafios internos', en: 'Internal challenges' },
    'ev.workshops.h3': { pt: 'Workshops & eventos especiais', en: 'Workshops & special events' },
    'ev.details': { pt: 'Ver detalhes', en: 'View details' },
    'ev.form.event': { pt: 'Evento *', en: 'Event *' },
    'ev.form.note': { pt: 'Para te inscreveres, usa a página', en: 'To enroll, use the' },
    'ev.ph.name': { pt: 'O teu nome', en: 'Your name' },
    'ev.ph.msg': { pt: 'A tua dúvida ou pedido de reserva...', en: 'Your question or booking request...' },
    'res.community.h2': { pt: 'O que a comunidade conquista', en: 'What the community achieves' },
    'res.real.lead': {
      pt: 'Antes e depois de membros da tribo. Disciplina, acompanhamento e comunidade.',
      en: 'Before and after from tribe members. Discipline, coaching and community.'
    },
    'res.project.p': {
      pt: 'O projeto prova que, com acompanhamento e comunidade, a transformação é possível.',
      en: 'The project proves that with coaching and community, transformation is possible.'
    },
    'enroll.aside.price': { pt: 'Preçário:', en: 'Pricing:' },
    'enroll.aside.packs': { pt: 'ver packs', en: 'view packs' },
    'enroll.ph.name': { pt: 'Nome por extenso', en: 'Full name' },
    'enroll.ph.address': { pt: 'Ex: Benfica, perto do Ville Vermont', en: 'e.g. Benfica, near Ville Vermont' },
    'enroll.ph.time': { pt: 'Ex: terças 18h30, sábados de manhã...', en: 'e.g. Tuesdays 6:30pm, Saturday mornings...' },
    'enroll.ph.goals': { pt: 'Metas fitness, experiência prévia, dúvidas...', en: 'Fitness goals, prior experience, questions...' },

    'day.mon': { pt: 'Segunda', en: 'Monday' },
    'day.tue': { pt: 'Terça', en: 'Tuesday' },
    'day.wed': { pt: 'Quarta', en: 'Wednesday' },
    'day.thu': { pt: 'Quinta', en: 'Thursday' },
    'day.fri': { pt: 'Sexta', en: 'Friday' },
    'day.sat': { pt: 'Sábado', en: 'Saturday' },
    'day.sun': { pt: 'Domingo', en: 'Sunday' },
  };

  function getLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'pt' || saved === 'en') return saved;
    return DEFAULT_LANG;
  }

  function setLang(lang) {
    if (lang !== 'pt' && lang !== 'en') return;
    localStorage.setItem(STORAGE_KEY, lang);
    applyLanguage(lang);
  }

  function t(key, lang) {
    const entry = translations[key];
    if (!entry) return null;
    return entry[lang] != null ? entry[lang] : entry.pt;
  }

  function applyLanguage(lang) {
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt';
    document.documentElement.setAttribute('data-lang', lang);

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const val = t(key, lang);
      if (val == null) return;
      el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      const val = t(key, lang);
      if (val == null) return;
      el.innerHTML = val;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = t(key, lang);
      if (val == null) return;
      el.setAttribute('placeholder', val);
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      const val = t(key, lang);
      if (val == null) return;
      el.setAttribute('aria-label', val);
    });

    // Toggle UI state
    document.querySelectorAll('.lang-toggle').forEach((wrap) => {
      wrap.querySelectorAll('[data-set-lang]').forEach((btn) => {
        const active = btn.getAttribute('data-set-lang') === lang;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    });

    // Optional: page title from data-i18n-title on <title> is awkward; skip
    document.dispatchEvent(new CustomEvent('wakanda:lang', { detail: { lang } }));
  }

  function initLangToggle() {
    document.querySelectorAll('[data-set-lang]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        setLang(btn.getAttribute('data-set-lang'));
      });
    });
    applyLanguage(getLang());
  }

  // Expose for main.js (WhatsApp messages, cart labels)
  window.WakandaI18n = {
    getLang,
    setLang,
    t,
    applyLanguage,
    translations,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLangToggle);
  } else {
    initLangToggle();
  }
})();
