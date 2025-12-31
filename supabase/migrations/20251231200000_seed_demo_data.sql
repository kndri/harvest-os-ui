-- Migration: Seed Demo Data
-- Description: Seeds realistic demo data for Grace Community Church
-- This creates a "well-oiled machine" church with multiple programs, events, speakers, resources, and budgets

BEGIN;

-- Organization: Grace Community Church
INSERT INTO organizations (id, name, slug)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Grace Community Church', 'grace-community')
ON CONFLICT (id) DO NOTHING;

-- Speakers (5 speakers)
INSERT INTO speakers (id, org_id, name, bio_en, bio_fr, email, website)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 
   'Pastor James Mitchell',
   'Senior Pastor with over 20 years of ministry experience. Passionate about prayer and spiritual growth.',
   'Pasteur principal avec plus de 20 ans d''expérience ministérielle. Passionné par la prière et la croissance spirituelle.',
   'james.mitchell@gracechurch.org', 'https://gracechurch.org/james-mitchell'),
  
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111',
   'Dr. Sarah Williams',
   'Renowned guest speaker and author specializing in fasting and spiritual disciplines.',
   'Conférencière invitée renommée et auteure spécialisée dans le jeûne et les disciplines spirituelles.',
   'sarah.williams@example.com', 'https://sarahwilliams.org'),
  
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111',
   'Youth Pastor Mike Chen',
   'Dedicated to youth ministry and creating impactful experiences for young people.',
   'Dédié au ministère jeunesse et à la création d''expériences marquantes pour les jeunes.',
   'mike.chen@gracechurch.org', NULL),
  
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111',
   'Worship Leader Maria Garcia',
   'Anointed worship leader leading the church in powerful times of praise and worship.',
   'Chef de louange ointe qui dirige l''église dans des temps puissants de louange et d''adoration.',
   'maria.garcia@gracechurch.org', NULL),
  
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111',
   'Elder Thomas Brown',
   'Long-time church elder and Bible teacher with deep knowledge of Scripture.',
   'Ancien d''église de longue date et enseignant biblique avec une connaissance approfondie des Écritures.',
   'thomas.brown@gracechurch.org', NULL)
ON CONFLICT (id) DO NOTHING;

-- Program 1: 21 Days of Prayer & Fasting (dated, Jan 6-26, 2025)
INSERT INTO programs (id, org_id, slug, title_en, title_fr, description_en, description_fr, 
                      start_date, end_date, duration_days, is_dated, config, branding, status)
VALUES
  ('11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111',
   '21-days-prayer-fasting',
   '21 Days of Prayer & Fasting',
   '21 Jours de Prière et de Jeûne',
   'Join us for 21 days of focused prayer and fasting as we seek God''s presence and direction for the new year.',
   'Rejoignez-nous pour 21 jours de prière et de jeûne concentrés alors que nous cherchons la présence et la direction de Dieu pour la nouvelle année.',
   '2025-01-06', '2025-01-26', 21, true,
   '{"resources": true, "prayer_wall": true, "events": true, "speakers": true}'::jsonb,
   '{"primary_color": "#10b981", "secondary_color": "#059669", "banner_url": null}'::jsonb,
   'published')
ON CONFLICT (id) DO NOTHING;

-- Program 2: Youth Summer Camp 2025 (dated, July 15-19, 2025)
INSERT INTO programs (id, org_id, slug, title_en, title_fr, description_en, description_fr,
                      start_date, end_date, duration_days, is_dated, config, branding, status)
VALUES
  ('11111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111111',
   'youth-summer-camp-2025',
   'Youth Summer Camp 2025',
   'Camp d''Été Jeunesse 2025',
   'An exciting 5-day camp experience for youth ages 13-18. Activities, worship, teaching, and community building.',
   'Une expérience de camp passionnante de 5 jours pour les jeunes de 13 à 18 ans. Activités, louange, enseignement et construction communautaire.',
   '2025-07-15', '2025-07-19', 5, true,
   '{"resources": true, "prayer_wall": false, "events": true, "speakers": true}'::jsonb,
   '{"primary_color": "#3b82f6", "secondary_color": "#2563eb"}'::jsonb,
   'published')
ON CONFLICT (id) DO NOTHING;

-- Program 3: Foundations Bible Study (undated, ongoing)
INSERT INTO programs (id, org_id, slug, title_en, title_fr, description_en, description_fr,
                      duration_days, is_dated, config, branding, status)
VALUES
  ('11111111-1111-1111-1111-111111111103', '11111111-1111-1111-1111-111111111111',
   'foundations-bible-study',
   'Foundations Bible Study',
   'Étude Biblique Fondations',
   'A 12-week foundational Bible study covering core Christian doctrines and principles.',
   'Une étude biblique fondamentale de 12 semaines couvrant les doctrines et principes chrétiens fondamentaux.',
   12, false,
   '{"resources": true, "prayer_wall": false, "events": false, "speakers": false}'::jsonb,
   '{"primary_color": "#8b5cf6", "secondary_color": "#7c3aed"}'::jsonb,
   'published')
ON CONFLICT (id) DO NOTHING;

-- Program Days for 21 Days of Prayer & Fasting (Days 1-21)
-- Day 1
INSERT INTO program_days (program_id, day_index, title_en, title_fr, devotional_en, devotional_fr,
                           scriptures_en, scriptures_fr, prayer_focus_en, prayer_focus_fr,
                           fasting_focus_en, fasting_focus_fr, notes_enabled)
VALUES
  ('11111111-1111-1111-1111-111111111101', 1,
   'A Fresh Start', 'Un Nouveau Départ',
   'As we begin this 21-day journey, let us approach God with open hearts and minds. This is a time to reset, refocus, and realign our priorities with God''s purposes.',
   'Alors que nous commençons ce voyage de 21 jours, approchons-nous de Dieu avec des cœurs et des esprits ouverts. C''est un moment pour réinitialiser, recentrer et réaligner nos priorités avec les desseins de Dieu.',
   ARRAY['Jeremiah 29:11', 'Isaiah 43:19', 'Lamentations 3:22-23'],
   ARRAY['Jérémie 29:11', 'Ésaïe 43:19', 'Lamentations 3:22-23'],
   'Pray for clarity and direction for the year ahead. Ask God to reveal His plans for your life.',
   'Priez pour la clarté et la direction pour l''année à venir. Demandez à Dieu de révéler Ses plans pour votre vie.',
   'Consider fasting from social media or entertainment. Focus your time on prayer and Scripture.',
   'Envisagez de jeûner des médias sociaux ou du divertissement. Concentrez votre temps sur la prière et les Écritures.',
   true);

-- Days 2-5 (sample content)
INSERT INTO program_days (program_id, day_index, title_en, title_fr, devotional_en, devotional_fr,
                           scriptures_en, scriptures_fr, prayer_focus_en, prayer_focus_fr,
                           fasting_focus_en, fasting_focus_fr, notes_enabled)
VALUES
  ('11111111-1111-1111-1111-111111111101', 2,
   'Seeking God''s Presence', 'Chercher la Présence de Dieu',
   'God desires to be close to us. Today, focus on drawing near to Him through worship and prayer.',
   'Dieu désire être proche de nous. Aujourd''hui, concentrez-vous sur le fait de vous approcher de Lui par la louange et la prière.',
   ARRAY['James 4:8', 'Psalm 16:11', 'Psalm 27:4'],
   ARRAY['Jacques 4:8', 'Psaume 16:11', 'Psaume 27:4'],
   'Pray for a deeper awareness of God''s presence in your daily life.',
   'Priez pour une prise de conscience plus profonde de la présence de Dieu dans votre vie quotidienne.',
   'Fast from one meal today. Use that time to seek God.',
   'Jeûnez d''un repas aujourd''hui. Utilisez ce temps pour chercher Dieu.',
   true),
  
  ('11111111-1111-1111-1111-111111111101', 3,
   'The Power of Prayer', 'Le Pouvoir de la Prière',
   'Prayer is not just asking God for things; it is communion with the Creator of the universe.',
   'La prière n''est pas seulement demander des choses à Dieu; c''est la communion avec le Créateur de l''univers.',
   ARRAY['Matthew 6:6', 'Philippians 4:6-7', '1 Thessalonians 5:17'],
   ARRAY['Matthieu 6:6', 'Philippiens 4:6-7', '1 Thessaloniciens 5:17'],
   'Pray for breakthrough in areas where you''ve been struggling.',
   'Priez pour une percée dans les domaines où vous avez lutté.',
   'Continue your fast. Remember to drink plenty of water.',
   'Continuez votre jeûne. N''oubliez pas de boire beaucoup d''eau.',
   true),
  
  ('11111111-1111-1111-1111-111111111101', 4,
   'Renewing Your Mind', 'Renouveler Votre Esprit',
   'Transformation begins in the mind. Allow God''s Word to renew your thinking and perspective.',
   'La transformation commence dans l''esprit. Permettez à la Parole de Dieu de renouveler votre pensée et votre perspective.',
   ARRAY['Romans 12:2', 'Ephesians 4:23', 'Philippians 4:8'],
   ARRAY['Romains 12:2', 'Éphésiens 4:23', 'Philippiens 4:8'],
   'Pray for God to transform your mind and align your thoughts with His.',
   'Priez pour que Dieu transforme votre esprit et aligne vos pensées avec les Siennes.',
   'Fast from negative thoughts and complaints. Focus on gratitude.',
   'Jeûnez des pensées négatives et des plaintes. Concentrez-vous sur la gratitude.',
   true),
  
  ('11111111-1111-1111-1111-111111111101', 5,
   'Walking in Faith', 'Marcher dans la Foi',
   'Faith is the foundation of our relationship with God. Trust Him even when you cannot see the way forward.',
   'La foi est le fondement de notre relation avec Dieu. Faites-Lui confiance même lorsque vous ne pouvez pas voir le chemin à suivre.',
   ARRAY['Hebrews 11:1', '2 Corinthians 5:7', 'Proverbs 3:5-6'],
   ARRAY['Hébreux 11:1', '2 Corinthiens 5:7', 'Proverbes 3:5-6'],
   'Pray for increased faith to trust God in all circumstances.',
   'Priez pour une foi accrue pour faire confiance à Dieu en toutes circonstances.',
   'Continue your fast. Trust God to provide strength.',
   'Continuez votre jeûne. Faites confiance à Dieu pour fournir la force.',
   true);

-- Days 6-21 (create remaining days with FULL comprehensive content)
DO $$
DECLARE
  day_num INTEGER;
  titles_en TEXT[] := ARRAY[
    'Breaking Strongholds', 'Freedom in Christ', 'The Joy of the Lord', 'Walking in Love',
    'Servant Leadership', 'Financial Breakthrough', 'Healing and Restoration', 'Spiritual Warfare',
    'The Word of God', 'Worship and Praise', 'Community and Fellowship', 'Generosity',
    'Forgiveness', 'Peace in Trials', 'Hope for Tomorrow', 'Victory in Christ'
  ];
  titles_fr TEXT[] := ARRAY[
    'Briser les Forteresses', 'Liberté en Christ', 'La Joie du Seigneur', 'Marcher dans l''Amour',
    'Leadership de Serviteur', 'Percée Financière', 'Guérison et Restauration', 'Combat Spirituel',
    'La Parole de Dieu', 'Louange et Adoration', 'Communauté et Communion', 'Générosité',
    'Pardon', 'Paix dans les Épreuves', 'Espoir pour Demain', 'Victoire en Christ'
  ];
  devotionals_en TEXT[] := ARRAY[
    'Strongholds are patterns of thinking and behavior that keep us bound. Today, identify areas where you need freedom and pray for breakthrough. God wants to set you free from every chain.',
    'In Christ, we have been set free from sin and death. This freedom is not a license to sin, but freedom to live as God intended. Walk in this freedom today.',
    'The joy of the Lord is your strength. Even in difficult circumstances, we can experience deep joy because our hope is in God, not our circumstances.',
    'Love is the greatest commandment and the mark of a true disciple. Today, ask God to help you love others as He loves you - unconditionally and sacrificially.',
    'Jesus came not to be served but to serve. True leadership is found in serving others. Look for opportunities to serve today.',
    'God cares about every area of our lives, including our finances. Trust Him as your provider and steward your resources wisely.',
    'God is a healer - physically, emotionally, and spiritually. Bring your wounds to Him today and trust in His healing power.',
    'We are in a spiritual battle, but we have been given spiritual weapons. Put on the full armor of God and stand firm.',
    'The Bible is God''s love letter to us. It is living and active, able to transform our hearts and minds. Spend time in it today.',
    'Worship is not just singing songs - it is a lifestyle of honoring God in everything we do. Let your life be an act of worship.',
    'We were created for community. God never intended us to walk alone. Invest in relationships and build genuine fellowship.',
    'God loves a cheerful giver. Generosity flows from a heart that trusts God as provider. Give freely and watch God multiply.',
    'Forgiveness is not easy, but it is essential. Unforgiveness is a prison that only hurts you. Choose to forgive today.',
    'Peace is not the absence of trouble, but the presence of God. In every trial, God offers His peace that surpasses understanding.',
    'Our hope is not in this world, but in the world to come. This hope anchors our souls and gives us strength to persevere.',
    'In Christ, we are more than conquerors. Victory is not just something we hope for - it is something we already have in Him.'
  ];
  devotionals_fr TEXT[] := ARRAY[
    'Les forteresses sont des schémas de pensée et de comportement qui nous maintiennent liés. Aujourd''hui, identifiez les domaines où vous avez besoin de liberté et priez pour une percée.',
    'En Christ, nous avons été libérés du péché et de la mort. Cette liberté n''est pas une licence pour pécher, mais la liberté de vivre comme Dieu l''a prévu.',
    'La joie du Seigneur est votre force. Même dans des circonstances difficiles, nous pouvons éprouver une joie profonde parce que notre espérance est en Dieu.',
    'L''amour est le plus grand commandement et la marque d''un vrai disciple. Aujourd''hui, demandez à Dieu de vous aider à aimer les autres comme Il vous aime.',
    'Jésus est venu non pour être servi mais pour servir. Le vrai leadership se trouve dans le service des autres.',
    'Dieu se soucie de tous les domaines de nos vies, y compris nos finances. Faites-Lui confiance comme votre pourvoyeur.',
    'Dieu est un guérisseur - physiquement, émotionnellement et spirituellement. Apportez vos blessures à Lui aujourd''hui.',
    'Nous sommes dans un combat spirituel, mais on nous a donné des armes spirituelles. Revêtez l''armure complète de Dieu.',
    'La Bible est la lettre d''amour de Dieu pour nous. Elle est vivante et active, capable de transformer nos cœurs.',
    'La louange n''est pas seulement chanter des chansons - c''est un style de vie d''honorer Dieu en tout ce que nous faisons.',
    'Nous avons été créés pour la communauté. Dieu ne nous a jamais destinés à marcher seuls. Investissez dans les relations.',
    'Dieu aime celui qui donne avec joie. La générosité découle d''un cœur qui fait confiance à Dieu comme pourvoyeur.',
    'Le pardon n''est pas facile, mais il est essentiel. Le non-pardon est une prison qui ne fait que vous blesser.',
    'La paix n''est pas l''absence de troubles, mais la présence de Dieu. Dans chaque épreuve, Dieu offre Sa paix.',
    'Notre espérance n''est pas dans ce monde, mais dans le monde à venir. Cette espérance ancre nos âmes.',
    'En Christ, nous sommes plus que vainqueurs. La victoire n''est pas seulement quelque chose que nous espérons - nous l''avons déjà en Lui.'
  ];
  scriptures_en_array TEXT[][] := ARRAY[
    ARRAY['2 Corinthians 10:4-5', 'Ephesians 6:10-18', '1 John 4:4'],
    ARRAY['Galatians 5:1', 'John 8:36', 'Romans 8:1-2'],
    ARRAY['Nehemiah 8:10', 'Psalm 16:11', 'Philippians 4:4'],
    ARRAY['1 Corinthians 13:4-7', 'John 13:34-35', '1 John 4:19'],
    ARRAY['Mark 10:45', 'Philippians 2:5-7', 'Matthew 20:26-28'],
    ARRAY['Philippians 4:19', 'Malachi 3:10', 'Luke 6:38'],
    ARRAY['Psalm 103:3', 'Isaiah 53:5', 'James 5:14-15'],
    ARRAY['Ephesians 6:12', '2 Corinthians 10:4', '1 Peter 5:8-9'],
    ARRAY['Hebrews 4:12', 'Psalm 119:105', '2 Timothy 3:16-17'],
    ARRAY['Psalm 95:1-2', 'John 4:23-24', 'Romans 12:1'],
    ARRAY['Hebrews 10:24-25', 'Acts 2:42', '1 John 1:7'],
    ARRAY['2 Corinthians 9:6-7', 'Luke 6:38', 'Proverbs 11:25'],
    ARRAY['Matthew 6:14-15', 'Ephesians 4:32', 'Colossians 3:13'],
    ARRAY['John 14:27', 'Philippians 4:6-7', 'Isaiah 26:3'],
    ARRAY['Romans 15:13', 'Hebrews 6:19', '1 Peter 1:3'],
    ARRAY['Romans 8:37', '1 Corinthians 15:57', '1 John 5:4']
  ];
  scriptures_fr_array TEXT[][] := ARRAY[
    ARRAY['2 Corinthiens 10:4-5', 'Éphésiens 6:10-18', '1 Jean 4:4'],
    ARRAY['Galates 5:1', 'Jean 8:36', 'Romains 8:1-2'],
    ARRAY['Néhémie 8:10', 'Psaume 16:11', 'Philippiens 4:4'],
    ARRAY['1 Corinthiens 13:4-7', 'Jean 13:34-35', '1 Jean 4:19'],
    ARRAY['Marc 10:45', 'Philippiens 2:5-7', 'Matthieu 20:26-28'],
    ARRAY['Philippiens 4:19', 'Malachie 3:10', 'Luc 6:38'],
    ARRAY['Psaume 103:3', 'Ésaïe 53:5', 'Jacques 5:14-15'],
    ARRAY['Éphésiens 6:12', '2 Corinthiens 10:4', '1 Pierre 5:8-9'],
    ARRAY['Hébreux 4:12', 'Psaume 119:105', '2 Timothée 3:16-17'],
    ARRAY['Psaume 95:1-2', 'Jean 4:23-24', 'Romains 12:1'],
    ARRAY['Hébreux 10:24-25', 'Actes 2:42', '1 Jean 1:7'],
    ARRAY['2 Corinthiens 9:6-7', 'Luc 6:38', 'Proverbes 11:25'],
    ARRAY['Matthieu 6:14-15', 'Éphésiens 4:32', 'Colossiens 3:13'],
    ARRAY['Jean 14:27', 'Philippiens 4:6-7', 'Ésaïe 26:3'],
    ARRAY['Romains 15:13', 'Hébreux 6:19', '1 Pierre 1:3'],
    ARRAY['Romains 8:37', '1 Corinthiens 15:57', '1 Jean 5:4']
  ];
  prayer_focus_en_array TEXT[] := ARRAY[
    'Pray for God to break every stronghold in your life. Ask Him to reveal areas where you need freedom.',
    'Pray for a deeper understanding of your freedom in Christ. Ask God to help you walk in this freedom daily.',
    'Pray for the joy of the Lord to fill your heart, regardless of your circumstances.',
    'Pray for God to help you love others as He loves you. Ask for opportunities to show love today.',
    'Pray for a servant''s heart. Ask God to show you how to serve others in your daily life.',
    'Pray for God''s provision in your finances. Trust Him as your provider and steward wisely.',
    'Pray for healing - physical, emotional, and spiritual. Bring your specific needs to God.',
    'Pray for protection and strength in spiritual warfare. Put on the armor of God daily.',
    'Pray for a deeper hunger for God''s Word. Ask Him to speak to you through Scripture today.',
    'Pray for a lifestyle of worship. Ask God to help you honor Him in everything you do.',
    'Pray for deeper relationships and genuine fellowship. Ask God to help you invest in community.',
    'Pray for a generous heart. Ask God to show you how to give freely and cheerfully.',
    'Pray for the strength to forgive those who have hurt you. Release them to God.',
    'Pray for God''s peace in the midst of trials. Trust that He is in control.',
    'Pray for hope to anchor your soul. Remember that your hope is in Christ, not this world.',
    'Pray for victory in every area of your life. Remember that in Christ, you are already victorious.'
  ];
  prayer_focus_fr_array TEXT[] := ARRAY[
    'Priez pour que Dieu brise chaque forteresse dans votre vie. Demandez-Lui de révéler les domaines où vous avez besoin de liberté.',
    'Priez pour une compréhension plus profonde de votre liberté en Christ. Demandez à Dieu de vous aider à marcher dans cette liberté quotidiennement.',
    'Priez pour que la joie du Seigneur remplisse votre cœur, indépendamment de vos circonstances.',
    'Priez pour que Dieu vous aide à aimer les autres comme Il vous aime. Demandez des opportunités de montrer l''amour aujourd''hui.',
    'Priez pour un cœur de serviteur. Demandez à Dieu de vous montrer comment servir les autres dans votre vie quotidienne.',
    'Priez pour la provision de Dieu dans vos finances. Faites-Lui confiance comme votre pourvoyeur.',
    'Priez pour la guérison - physique, émotionnelle et spirituelle. Apportez vos besoins spécifiques à Dieu.',
    'Priez pour la protection et la force dans le combat spirituel. Revêtez l''armure de Dieu quotidiennement.',
    'Priez pour une faim plus profonde de la Parole de Dieu. Demandez-Lui de vous parler à travers les Écritures aujourd''hui.',
    'Priez pour un style de vie de louange. Demandez à Dieu de vous aider à L''honorer en tout ce que vous faites.',
    'Priez pour des relations plus profondes et une vraie communion. Demandez à Dieu de vous aider à investir dans la communauté.',
    'Priez pour un cœur généreux. Demandez à Dieu de vous montrer comment donner librement et avec joie.',
    'Priez pour la force de pardonner ceux qui vous ont blessé. Libérez-les à Dieu.',
    'Priez pour la paix de Dieu au milieu des épreuves. Faites confiance qu''Il est aux commandes.',
    'Priez pour que l''espérance ancre votre âme. Rappelez-vous que votre espérance est en Christ.',
    'Priez pour la victoire dans tous les domaines de votre vie. Rappelez-vous qu''en Christ, vous êtes déjà victorieux.'
  ];
  fasting_focus_en_array TEXT[] := ARRAY[
    'Fast from negative self-talk and limiting beliefs. Replace them with God''s truth about who you are.',
    'Fast from anything that keeps you bound. Use this time to focus on your freedom in Christ.',
    'Fast from complaining and negativity. Focus on gratitude and the goodness of God.',
    'Fast from selfishness. Look for ways to put others first and show love.',
    'Fast from pride and self-promotion. Humble yourself and serve others.',
    'Fast from worry about finances. Trust God as your provider and give generously.',
    'Fast from holding onto past hurts. Release them to God and receive His healing.',
    'Fast from fear and anxiety. Stand firm in faith, knowing God fights for you.',
    'Fast from distractions. Set aside dedicated time to read and meditate on Scripture.',
    'Fast from anything that takes God''s place in your heart. Make worship your priority.',
    'Fast from isolation. Reach out to others and invest in meaningful relationships.',
    'Fast from greed and hoarding. Practice generosity and trust God to provide.',
    'Fast from bitterness and resentment. Choose forgiveness and release those who hurt you.',
    'Fast from trying to control everything. Surrender to God and trust in His peace.',
    'Fast from despair and hopelessness. Fix your eyes on Jesus, the author and perfecter of your faith.',
    'Fast from defeatist thinking. Remember that you are more than a conqueror in Christ.'
  ];
  fasting_focus_fr_array TEXT[] := ARRAY[
    'Jeûnez des pensées négatives sur vous-même et des croyances limitantes. Remplacez-les par la vérité de Dieu sur qui vous êtes.',
    'Jeûnez de tout ce qui vous maintient lié. Utilisez ce temps pour vous concentrer sur votre liberté en Christ.',
    'Jeûnez des plaintes et de la négativité. Concentrez-vous sur la gratitude et la bonté de Dieu.',
    'Jeûnez de l''égoïsme. Cherchez des moyens de mettre les autres en premier et de montrer l''amour.',
    'Jeûnez de l''orgueil et de l''auto-promotion. Humiliez-vous et servez les autres.',
    'Jeûnez de l''inquiétude concernant les finances. Faites confiance à Dieu comme votre pourvoyeur.',
    'Jeûnez de vous accrocher aux blessures passées. Libérez-les à Dieu et recevez Sa guérison.',
    'Jeûnez de la peur et de l''anxiété. Tenez ferme dans la foi, sachant que Dieu combat pour vous.',
    'Jeûnez des distractions. Réservez du temps dédié pour lire et méditer sur les Écritures.',
    'Jeûnez de tout ce qui prend la place de Dieu dans votre cœur. Faites de la louange votre priorité.',
    'Jeûnez de l''isolement. Tendez la main aux autres et investissez dans des relations significatives.',
    'Jeûnez de l''avidité et de l''accumulation. Pratiquez la générosité et faites confiance à Dieu.',
    'Jeûnez de l''amertume et du ressentiment. Choisissez le pardon et libérez ceux qui vous ont blessé.',
    'Jeûnez d''essayer de tout contrôler. Abandonnez-vous à Dieu et faites confiance à Sa paix.',
    'Jeûnez du désespoir et du désespoir. Fixez vos yeux sur Jésus, l''auteur et le perfectionneur de votre foi.',
    'Jeûnez de la pensée défaitiste. Rappelez-vous que vous êtes plus qu''un vainqueur en Christ.'
  ];
BEGIN
  FOR day_num IN 6..21 LOOP
    INSERT INTO program_days (program_id, day_index, title_en, title_fr, devotional_en, devotional_fr,
                               scriptures_en, scriptures_fr, prayer_focus_en, prayer_focus_fr,
                               fasting_focus_en, fasting_focus_fr, notes_enabled)
    VALUES (
      '11111111-1111-1111-1111-111111111101',
      day_num,
      titles_en[day_num - 5],
      titles_fr[day_num - 5],
      devotionals_en[day_num - 5],
      devotionals_fr[day_num - 5],
      scriptures_en_array[day_num - 5],
      scriptures_fr_array[day_num - 5],
      prayer_focus_en_array[day_num - 5],
      prayer_focus_fr_array[day_num - 5],
      fasting_focus_en_array[day_num - 5],
      fasting_focus_fr_array[day_num - 5],
      true
    );
  END LOOP;
END $$;

-- Program Days for Youth Camp (5 days)
INSERT INTO program_days (program_id, day_index, title_en, title_fr, activities_en, activities_fr, notes_enabled)
VALUES
  ('11111111-1111-1111-1111-111111111102', 1,
   'Arrival & Welcome', 'Arrivée et Bienvenue',
   'Registration, cabin assignments, icebreaker games, welcome session, evening worship.',
   'Inscription, attribution des cabines, jeux brise-glace, session de bienvenue, louange du soir.',
   true),
  ('11111111-1111-1111-1111-111111111102', 2,
   'Morning Devotion & Activities', 'Dévotion Matinale et Activités',
   'Morning worship, team building activities, workshops, free time, evening session.',
   'Louange matinale, activités de renforcement d''équipe, ateliers, temps libre, session du soir.',
   true),
  ('11111111-1111-1111-1111-111111111102', 3,
   'Adventure Day', 'Journée d''Aventure',
   'Outdoor activities, hiking, games, afternoon teaching, bonfire and testimonies.',
   'Activités de plein air, randonnée, jeux, enseignement de l''après-midi, feu de camp et témoignages.',
   true),
  ('11111111-1111-1111-1111-111111111102', 4,
   'Service & Outreach', 'Service et Témoignage',
   'Community service project, outreach activities, afternoon workshops, evening celebration.',
   'Projet de service communautaire, activités de témoignage, ateliers de l''après-midi, célébration du soir.',
   true),
  ('11111111-1111-1111-1111-111111111102', 5,
   'Closing & Commissioning', 'Clôture et Envoi',
   'Final worship session, commissioning service, testimonies, departure.',
   'Session de louange finale, service d''envoi, témoignages, départ.',
   true);

-- Program Days for Foundations Bible Study (12 weeks - sample first 3)
INSERT INTO program_days (program_id, day_index, title_en, title_fr, devotional_en, devotional_fr,
                           scriptures_en, scriptures_fr, reflection_questions_en, reflection_questions_fr, notes_enabled)
VALUES
  ('11111111-1111-1111-1111-111111111103', 1,
   'The Authority of Scripture', 'L''Autorité des Écritures',
   'Understanding why we trust the Bible as God''s Word and how it applies to our lives today.',
   'Comprendre pourquoi nous faisons confiance à la Bible comme Parole de Dieu et comment elle s''applique à nos vies aujourd''hui.',
   ARRAY['2 Timothy 3:16-17', 'Psalm 119:105', 'Hebrews 4:12'],
   ARRAY['2 Timothée 3:16-17', 'Psaume 119:105', 'Hébreux 4:12'],
   ARRAY['What does it mean for Scripture to be "God-breathed"?', 'How has the Bible impacted your life?'],
   ARRAY['Que signifie que les Écritures soient "inspirées de Dieu"?', 'Comment la Bible a-t-elle impacté votre vie?'],
   true),
  ('11111111-1111-1111-1111-111111111103', 2,
   'The Trinity', 'La Trinité',
   'Exploring the mystery of one God in three persons: Father, Son, and Holy Spirit.',
   'Explorer le mystère d''un seul Dieu en trois personnes: Père, Fils et Saint-Esprit.',
   ARRAY['Matthew 28:19', '2 Corinthians 13:14', 'John 1:1-3'],
   ARRAY['Matthieu 28:19', '2 Corinthiens 13:14', 'Jean 1:1-3'],
   ARRAY['How do you understand the Trinity?', 'What role does each person of the Trinity play?'],
   ARRAY['Comment comprenez-vous la Trinité?', 'Quel rôle joue chaque personne de la Trinité?'],
   true),
  ('11111111-1111-1111-1111-111111111103', 3,
   'The Person of Jesus Christ', 'La Personne de Jésus-Christ',
   'Understanding who Jesus is: fully God and fully man, our Savior and Lord.',
   'Comprendre qui est Jésus: pleinement Dieu et pleinement homme, notre Sauveur et Seigneur.',
   ARRAY['John 1:14', 'Philippians 2:5-11', 'Colossians 1:15-20'],
   ARRAY['Jean 1:14', 'Philippiens 2:5-11', 'Colossiens 1:15-20'],
   ARRAY['What does it mean that Jesus is both God and man?', 'How does Jesus'' humanity help you relate to Him?'],
   ARRAY['Que signifie que Jésus soit à la fois Dieu et homme?', 'Comment l''humanité de Jésus vous aide-t-elle à vous rapporter à Lui?'],
   true);

-- Create remaining 9 weeks for Foundations
DO $$
DECLARE
  week_num INTEGER;
  titles_en TEXT[] := ARRAY[
    'The Work of the Holy Spirit', 'Salvation by Grace', 'The Church', 'Baptism and Communion',
    'Prayer and Worship', 'Christian Living', 'The End Times', 'Sharing Your Faith', 'Growing in Christ'
  ];
  titles_fr TEXT[] := ARRAY[
    'L''Œuvre du Saint-Esprit', 'Le Salut par la Grâce', 'L''Église', 'Le Baptême et la Communion',
    'La Prière et l''Adoration', 'La Vie Chrétienne', 'Les Temps de la Fin', 'Partager Votre Foi', 'Grandir en Christ'
  ];
BEGIN
  FOR week_num IN 4..12 LOOP
    INSERT INTO program_days (program_id, day_index, title_en, title_fr, devotional_en, devotional_fr,
                               scriptures_en, scriptures_fr, reflection_questions_en, reflection_questions_fr, notes_enabled)
    VALUES (
      '11111111-1111-1111-1111-111111111103',
      week_num,
      titles_en[week_num - 3],
      titles_fr[week_num - 3],
      'Continue studying foundational Christian truths.',
      'Continuez à étudier les vérités chrétiennes fondamentales.',
      ARRAY['John 3:16', 'Romans 8:1', 'Ephesians 2:8-9'],
      ARRAY['Jean 3:16', 'Romains 8:1', 'Éphésiens 2:8-9'],
      ARRAY['What does this topic mean to you?', 'How will you apply this truth?'],
      ARRAY['Que signifie ce sujet pour vous?', 'Comment appliquerez-vous cette vérité?'],
      true
    );
  END LOOP;
END $$;

-- Events for 21 Days of Prayer & Fasting
INSERT INTO program_events (program_id, title_en, title_fr, description_en, description_fr,
                             starts_at, ends_at, speaker_id, location)
VALUES
  ('11111111-1111-1111-1111-111111111101',
   'Opening Service', 'Service d''Ouverture',
   'Join us as we kick off 21 days of prayer and fasting with a powerful time of worship and prayer.',
   'Rejoignez-nous alors que nous lançons 21 jours de prière et de jeûne avec un temps puissant de louange et de prière.',
   '2025-01-06 19:00:00+00', '2025-01-06 21:00:00+00',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Main Sanctuary'),
  
  ('11111111-1111-1111-1111-111111111101',
   'Mid-Week Prayer Gathering', 'Rassemblement de Prière de Mi-Semaine',
   'A special mid-week time of corporate prayer and encouragement.',
   'Un temps spécial de prière corporative et d''encouragement en milieu de semaine.',
   '2025-01-15 19:00:00+00', '2025-01-15 20:30:00+00',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Main Sanctuary'),
  
  ('11111111-1111-1111-1111-111111111101',
   'Closing Celebration', 'Célébration de Clôture',
   'Celebrate what God has done during these 21 days with testimonies, worship, and a special message.',
   'Célébrez ce que Dieu a fait pendant ces 21 jours avec des témoignages, de la louange et un message spécial.',
   '2025-01-26 18:00:00+00', '2025-01-26 21:00:00+00',
   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Main Sanctuary');

-- Events for Youth Camp
INSERT INTO program_events (program_id, title_en, title_fr, description_en, description_fr,
                             starts_at, ends_at, speaker_id, location)
VALUES
  ('11111111-1111-1111-1111-111111111102',
   'Morning Worship', 'Louange Matinale',
   'Start each day with powerful worship and a message from God''s Word.',
   'Commencez chaque journée avec une louange puissante et un message de la Parole de Dieu.',
   '2025-07-15 09:00:00+00', '2025-07-15 10:30:00+00',
   'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Camp Main Hall'),
  
  ('11111111-1111-1111-1111-111111111102',
   'Workshop: Identity in Christ', 'Atelier: Identité en Christ',
   'Interactive workshop helping youth discover their identity and purpose in Christ.',
   'Atelier interactif aidant les jeunes à découvrir leur identité et leur but en Christ.',
   '2025-07-16 14:00:00+00', '2025-07-16 15:30:00+00',
   'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Workshop Room A'),
  
  ('11111111-1111-1111-1111-111111111102',
   'Evening Bonfire', 'Feu de Camp du Soir',
   'A time of fellowship, testimonies, and worship around the campfire.',
   'Un temps de communion, de témoignages et de louange autour du feu de camp.',
   '2025-07-17 19:00:00+00', '2025-07-17 21:00:00+00',
   NULL, 'Campfire Area'),
  
  ('11111111-1111-1111-1111-111111111102',
   'Water Games & Fun', 'Jeux d''Eau et Amusement',
   'Afternoon of water games, team competitions, and fun activities.',
   'Après-midi de jeux d''eau, compétitions d''équipe et activités amusantes.',
   '2025-07-18 14:00:00+00', '2025-07-18 17:00:00+00',
   NULL, 'Recreation Area'),
  
  ('11111111-1111-1111-1111-111111111102',
   'Final Celebration Service', 'Service de Célébration Finale',
   'Closing service with worship, testimonies, and commissioning.',
   'Service de clôture avec louange, témoignages et envoi.',
   '2025-07-19 19:00:00+00', '2025-07-19 21:00:00+00',
   'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Camp Main Hall');

-- Resources for 21 Days of Prayer & Fasting
INSERT INTO resources (program_id, title_en, title_fr, description_en, description_fr,
                       category, language, storage_path, file_type, file_size)
VALUES
  ('11111111-1111-1111-1111-111111111101',
   'Prayer Guide', 'Guide de Prière',
   'A comprehensive guide to prayer during the 21 days.',
   'Un guide complet sur la prière pendant les 21 jours.',
   'guide', 'both', 'resources/prayer-guide-2025.pdf', 'application/pdf', 2048000),
  
  ('11111111-1111-1111-1111-111111111101',
   'Fasting Tips', 'Conseils sur le Jeûne',
   'Practical tips for different types of fasts.',
   'Conseils pratiques pour différents types de jeûnes.',
   'guide', 'both', 'resources/fasting-tips.pdf', 'application/pdf', 1024000),
  
  ('11111111-1111-1111-1111-111111111101',
   'Daily Devotional Book', 'Livre de Dévotion Quotidienne',
   'Complete devotional book for all 21 days.',
   'Livre de dévotion complet pour les 21 jours.',
   'book', 'both', 'resources/daily-devotional-2025.pdf', 'application/pdf', 5120000);

-- Resources for Youth Camp
INSERT INTO resources (program_id, title_en, title_fr, description_en, description_fr,
                       category, language, storage_path, file_type, file_size)
VALUES
  ('11111111-1111-1111-1111-111111111102',
   'Camp Schedule', 'Horaire du Camp',
   'Complete schedule for all camp activities.',
   'Horaire complet de toutes les activités du camp.',
   'schedule', 'both', 'resources/camp-schedule-2025.pdf', 'application/pdf', 512000),
  
  ('11111111-1111-1111-1111-111111111102',
   'Permission Form', 'Formulaire d''Autorisation',
   'Required permission and medical forms for camp attendance.',
   'Formulaires d''autorisation et médicaux requis pour la participation au camp.',
   'form', 'both', 'resources/camp-permission-form.pdf', 'application/pdf', 256000);

-- Resources for Foundations Bible Study
INSERT INTO resources (program_id, title_en, title_fr, description_en, description_fr,
                       category, language, storage_path, file_type, file_size)
VALUES
  ('11111111-1111-1111-1111-111111111103',
   'Study Guide', 'Guide d''Étude',
   'Complete study guide for all 12 weeks.',
   'Guide d''étude complet pour les 12 semaines.',
   'guide', 'both', 'resources/foundations-study-guide.pdf', 'application/pdf', 3072000),
  
  ('11111111-1111-1111-1111-111111111103',
   'Video Series', 'Série Vidéo',
   'Link to video teaching series.',
   'Lien vers la série d''enseignements vidéo.',
   'video', 'both', 'https://gracechurch.org/foundations-videos', 'video', NULL),
  
  ('11111111-1111-1111-1111-111111111103',
   'Discussion Questions', 'Questions de Discussion',
   'Weekly discussion questions for small groups.',
   'Questions de discussion hebdomadaires pour les petits groupes.',
   'guide', 'both', 'resources/foundations-discussion-questions.pdf', 'application/pdf', 512000),
  
  ('11111111-1111-1111-1111-111111111103',
   'Memory Verses', 'Versets à Mémoriser',
   'Key verses to memorize for each week.',
   'Versets clés à mémoriser pour chaque semaine.',
   'guide', 'both', 'resources/foundations-memory-verses.pdf', 'application/pdf', 256000);

-- Additional Resources for 21 Days Prayer Program
INSERT INTO resources (program_id, title_en, title_fr, description_en, description_fr,
                       category, language, storage_path, file_type, file_size)
VALUES
  ('11111111-1111-1111-1111-111111111101',
   'Scripture Reading Plan', 'Plan de Lecture Biblique',
   'Daily scripture reading plan for the 21 days.',
   'Plan de lecture biblique quotidien pour les 21 jours.',
   'guide', 'both', 'resources/prayer-scripture-plan.pdf', 'application/pdf', 384000),
  
  ('11111111-1111-1111-1111-111111111101',
   'Prayer Journal Template', 'Modèle de Journal de Prière',
   'Printable prayer journal template.',
   'Modèle de journal de prière imprimable.',
   'form', 'both', 'resources/prayer-journal-template.pdf', 'application/pdf', 128000),
  
  ('11111111-1111-1111-1111-111111111101',
   'Worship Playlist', 'Liste de Lecture de Louange',
   'Curated worship music playlist for the 21 days.',
   'Liste de lecture de musique de louange pour les 21 jours.',
   'media', 'both', 'https://open.spotify.com/playlist/prayer-fasting-2025', 'link', NULL);

-- Prayer Requests for 21 Days of Prayer & Fasting (20 requests - FULL data)
INSERT INTO prayer_requests (program_id, content, is_anonymous, is_approved, prayed_count)
VALUES
  ('11111111-1111-1111-1111-111111111101',
   'Please pray for my family''s financial situation. We are trusting God for provision.',
   false, true, 12),
  
  ('11111111-1111-1111-1111-111111111101',
   'Praying for healing for my mother who is battling cancer. We believe God is our healer.',
   false, true, 28),
  
  ('11111111-1111-1111-1111-111111111101',
   'Need prayer for direction in my career. Feeling uncertain about next steps.',
   true, true, 15),
  
  ('11111111-1111-1111-1111-111111111101',
   'Praying for restoration in my marriage. We need God''s intervention.',
   true, true, 8),
  
  ('11111111-1111-1111-1111-111111111101',
   'Please pray for my son who is struggling with addiction. We need a breakthrough.',
   false, true, 35),
  
  ('11111111-1111-1111-1111-111111111101',
   'Praying for peace in our nation and for our leaders to seek God.',
   false, true, 42),
  
  ('11111111-1111-1111-1111-111111111101',
   'Need prayer for strength during this difficult season. Feeling overwhelmed.',
   true, false, 0),
  
  ('11111111-1111-1111-1111-111111111101',
   'Praying for my friend who doesn''t know Jesus. Praying for opportunities to share.',
   false, false, 0),
  
  ('11111111-1111-1111-1111-111111111101',
   'Please pray for wisdom in making important decisions about my future.',
   true, true, 19),
  
  ('11111111-1111-1111-1111-111111111101',
   'Praying for unity in our church family and for God''s presence to be evident.',
   false, true, 31),
  
  ('11111111-1111-1111-1111-111111111101',
   'Praying for my daughter''s health. She has been struggling with chronic pain.',
   false, true, 24),
  
  ('11111111-1111-1111-1111-111111111101',
   'Need prayer for my job situation. Facing potential layoffs and need God''s guidance.',
   true, true, 18),
  
  ('11111111-1111-1111-1111-111111111101',
   'Praying for breakthrough in my studies. Final exams are coming up and I need focus.',
   false, true, 11),
  
  ('11111111-1111-1111-1111-111111111101',
   'Please pray for our small group. We need unity and deeper relationships.',
   false, true, 9),
  
  ('11111111-1111-1111-1111-111111111101',
   'Praying for my neighbor who lost their job. They need provision and hope.',
   true, true, 7),
  
  ('11111111-1111-1111-1111-111111111101',
   'Need prayer for anxiety and panic attacks. Trusting God for peace.',
   true, false, 0),
  
  ('11111111-1111-1111-1111-111111111101',
   'Praying for missionaries we support. They need protection and open doors.',
   false, true, 16),
  
  ('11111111-1111-1111-1111-111111111101',
   'Please pray for my relationship with my parents. We need reconciliation.',
   true, true, 13),
  
  ('11111111-1111-1111-1111-111111111101',
   'Praying for breakthrough in my business. Need God''s favor and wisdom.',
   false, true, 22),
  
  ('11111111-1111-1111-1111-111111111101',
   'Praying for our youth group. They need passion for God and protection from the world.',
   false, true, 27);

-- Budget Events
INSERT INTO budget_events (id, org_id, name, description, start_date, end_date, status)
VALUES
  ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111111',
   '21 Days of Prayer Budget', 'Budget for the 21 Days of Prayer & Fasting program',
   '2025-01-01', '2025-01-31', 'active'),
  
  ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111111',
   'Youth Summer Camp 2025', 'Budget for Youth Summer Camp expenses and revenue',
   '2025-07-01', '2025-07-31', 'draft');

-- Budget Line Items (Expenses) for 21 Days of Prayer
INSERT INTO budget_line_items (budget_event_id, category, description, projected_amount, actual_amount, notes)
VALUES
  ('22222222-2222-2222-2222-222222222201', 'Venue',
   'Main Sanctuary rental for opening and closing services', 500.00, 500.00, 'Confirmed'),
  
  ('22222222-2222-2222-2222-222222222201', 'Printed Materials',
   'Prayer guides, devotional books, fasting tips', 1200.00, 1350.00, 'Over budget due to additional copies'),
  
  ('22222222-2222-2222-2222-222222222201', 'Food',
   'Refreshments for mid-week gathering', 300.00, 285.00, 'Under budget'),
  
  ('22222222-2222-2222-2222-222222222201', 'A/V Equipment',
   'Sound system and livestream setup', 800.00, 750.00, 'Negotiated discount');

-- Budget Line Items for Youth Camp
INSERT INTO budget_line_items (budget_event_id, category, description, projected_amount, actual_amount, notes)
VALUES
  ('22222222-2222-2222-2222-222222222202', 'Facility Rental',
   'Camp facility rental for 5 days', 5000.00, 0.00, 'Pending confirmation'),
  
  ('22222222-2222-2222-2222-222222222202', 'Food',
   'Meals for 50 campers and staff', 2500.00, 0.00, 'To be ordered'),
  
  ('22222222-2222-2222-2222-222222222202', 'Supplies',
   'Camp materials, games, equipment', 800.00, 0.00, NULL),
  
  ('22222222-2222-2222-2222-222222222202', 'Transportation',
   'Bus rental for campers', 1200.00, 0.00, 'Quote received');

-- Budget Revenue for 21 Days of Prayer
INSERT INTO budget_revenue (budget_event_id, type, description, amount, received_amount, pledger_name)
VALUES
  ('22222222-2222-2222-2222-222222222201', 'pledge',
   'Pledge from John Smith', 500.00, 500.00, 'John Smith'),
  
  ('22222222-2222-2222-2222-222222222201', 'pledge',
   'Pledge from Mary Johnson', 300.00, 200.00, 'Mary Johnson'),
  
  ('22222222-2222-2222-2222-222222222201', 'offering',
   'General offering received', 450.00, 450.00, NULL),
  
  ('22222222-2222-2222-2222-222222222201', 'other',
   'Miscellaneous donations', 150.00, 150.00, NULL);

-- Budget Revenue for Youth Camp
INSERT INTO budget_revenue (budget_event_id, type, description, amount, received_amount, pledger_name)
VALUES
  ('22222222-2222-2222-2222-222222222202', 'pledge',
   'Pledge from Camp Sponsor Fund', 2000.00, 0.00, 'Camp Sponsor Fund'),
  
  ('22222222-2222-2222-2222-222222222202', 'pledge',
   'Pledge from Local Business Partnership', 1500.00, 1500.00, 'Local Business Partnership'),
  
  ('22222222-2222-2222-2222-222222222202', 'other',
   'Registration fees (estimated)', 3750.00, 0.00, NULL),
  
  ('22222222-2222-2222-2222-222222222202', 'offering',
   'Special offering for camp scholarships', 800.00, 800.00, NULL);

-- Additional Budget Line Items for 21 Days Prayer (more comprehensive)
INSERT INTO budget_line_items (budget_event_id, category, description, projected_amount, actual_amount, notes)
VALUES
  ('22222222-2222-2222-2222-222222222201', 'Marketing',
   'Social media ads and promotional materials', 400.00, 380.00, 'Under budget'),
  
  ('22222222-2222-2222-2222-222222222201', 'Technology',
   'Livestream equipment and setup', 600.00, 600.00, 'On budget'),
  
  ('22222222-2222-2222-2222-222222222201', 'Administration',
   'Program coordination and admin costs', 200.00, 195.00, 'Under budget');

-- Additional Budget Revenue for 21 Days Prayer
INSERT INTO budget_revenue (budget_event_id, type, description, amount, received_amount, pledger_name)
VALUES
  ('22222222-2222-2222-2222-222222222201', 'pledge',
   'Pledge from Church Foundation', 1000.00, 1000.00, 'Church Foundation'),
  
  ('22222222-2222-2222-2222-222222222201', 'pledge',
   'Pledge from Anonymous Donor', 750.00, 500.00, 'Anonymous Donor'),
  
  ('22222222-2222-2222-2222-222222222201', 'offering',
   'Special prayer offering', 320.00, 320.00, NULL);

COMMIT;
