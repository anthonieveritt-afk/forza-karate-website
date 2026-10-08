// Permanent redirects from the old forzakarate.co.uk WordPress URLs.
// Built from the Oct 2026 crawl of the old site. Order: specific rules first.
import type { Redirect } from 'next/dist/lib/load-custom-routes'

const to = (destination: string, ...sources: string[]): Redirect[] =>
  sources.map((source) => ({ source, destination, permanent: true }))

export const legacyRedirects: Redirect[] = [
  // → /join (2)
  ...to("/join", "/join-today", "/join-today-2"),

  // → /join/enrol (5)
  ...to("/join/enrol", "/direct-debit-set-up", "/join-today/making-your-first-payment", "/late-payments", "/make-first-payment-late-payments-here", "/standing-order-mandate"),

  // → /join/apply-licence (1)
  ...to("/join/apply-licence", "/apply-for-your-first-licence"),

  // → /members (1)
  ...to("/members", "/student-portal"),

  // → /members/licence (1)
  ...to("/members/licence", "/renew-licence"),

  // → /members/grading (1)
  ...to("/members/grading", "/child-grading-registration"),

  // → /admin (1)
  ...to("/admin", "/admin/belt-order-form"),

  // → /gradings (2)
  ...to("/gradings", "/exam", "/grading"),

  // → /gallery (9)
  ...to("/gallery", "/gallery/association-training", "/gallery/black-belts", "/gallery/competition-preparation-training", "/gallery/england-national-team", "/gallery/joe-kellaway", "/gallery/paris-karate-open-2020", "/gallery/rayleigh-dojo", "/gallery/southend-dojo", "/gallery/southern-england-regional-squad"),

  // → /classes (27)
  ...to("/classes", "/back-to-school-deal-september-only", "/class-closure-for-half-term", "/class-schedules-and-restart-dates", "/classes-closed-for-half-term", "/classes-closed-for-summer", "/classes-resume-as-of-4th-december", "/closed-for-the-summer", "/club-closure-for-christmas-and-new-year", "/easter-break-class-closure", "/free-trial-classes-at-forza-karate-club-september-only", "/jhka-summer-course-matt-rombeaux-kumite", "/jhka-summer-course-special-guest-instructor"),
  ...to("/classes", "/no-class-at-rps-on-saturday-21st-jan", "/no-lessons-during-half-term", "/para-karate", "/para-karate-2", "/para-karate-training", "/summer-camp", "/summercamp", "/upminster-dojo-we-have-a-few-spaces-available", "/upminster-karate-kids-4-6-years-spaces-available", "/we-are-recruiting-new-members", "/weekly-classes-closed-for-half-term", "/welcome-back-forza"),
  ...to("/classes", "/welcome-back-forza-karate-club", "/welcome-back-forza-karate-club-restarting-all-classes-from-5th-september", "/welcome-back-to-karate-classes-return-monday-7th-september"),

  // → /classes/ninjas (1)
  ...to("/classes/ninjas", "/forza-ninjas-infants"),

  // → /classes/juniors (1)
  ...to("/classes/juniors", "/forza-kids-juniors"),

  // → /classes/seniors (2)
  ...to("/classes/seniors", "/11-years-plus-lessons-are-a-blast", "/forza-club-11yrsplus"),

  // → /dojos (6)
  ...to("/dojos", "/basildon", "/basildon-sporting-village-classes-start-11th-may", "/club-list", "/clubs", "/shoeburyness-dojo", "/welcome-to-forza-karates-new-club-thorpe-bay"),

  // → /dojos/rayleigh (3)
  ...to("/dojos/rayleigh", "/rayleigh-primary-school-2013-present-day", "/rayleigh-scout-hall-2012-2019", "/rps-dojo"),

  // → /dojos/upminster (2)
  ...to("/dojos/upminster", "/upminster-2013-present-day", "/upminster-dojo"),

  // → /instructors (2)
  ...to("/instructors", "/instructor-exam", "/our-team-of-instructors"),

  // → /team (5)
  ...to("/team", "/competitions", "/england-karate-team", "/team-forza", "/team-forza-for-the-british-4-nations", "/what-is-sport-karate"),

  // → /hall-of-fame (3)
  ...to("/hall-of-fame", "/achievements-kobe-yogarajah", "/brown-belts", "/honorary-black-belts"),

  // → /register/super-champs (5)
  ...to("/register/super-champs", "/saturday-super-champs-for-2025", "/saturday-superchamps", "/super-champs", "/super-champs-2", "/super-champs-return"),

  // → /register/prep-training (5)
  ...to("/register/prep-training", "/2022-preparation-training", "/2024-preparation-training", "/competition-karate-prep-training-1-3", "/preparation-training-is-back", "/preparation-training-is-back-2"),

  // → /register/championships (2)
  ...to("/register/championships", "/2-person-registration", "/3-persons-registration"),

  // → /why-karate (1)
  ...to("/why-karate", "/welcome/karate-art"),

  // → /contact (1)
  ...to("/contact", "/links"),

  // → /news (232)
  ...to("/news", "/1992-2", "/2-bronze-for-forza-at-the-2025-ekf-senior-championships", "/2-bronze-medal-5th-place-for-forza-at-the-e1", "/2012-2", "/2014-2", "/2014-christmas-presentation-evening", "/2015-club-championships-rayleigh-rps", "/2016-forza-club-championships", "/2021-annual-club-competition", "/2023-super-champs", "/2023_forza_karate_championships", "/2024-ekf-senior-championships-write-up"),
  ...to("/news", "/2024-team-fka-association-training", "/2025-english-kyu-grade-karate-championships-sheffield", "/357-2", "/4-forza-students-at-2023-bkf-championships-motherwell", "/5-gold-at-the-jhka-invitational", "/5813-2", "/5th-place-at-marseille-karate-open-for-yuan", "/6374-2", "/6840-2", "/6957-2", "/a-new-brown-belt-in-our-ranks", "/active-essex-young-sport-award-winner"),
  ...to("/news", "/adult-classes-interested", "/after-school-class-grade-up", "/after-school-club-belts-up", "/april-kyu-grading", "/association-squad-training-4th-march-rayleigh", "/association-squad-training-heathfield", "/basildon-dojo-grading-results", "/basildon-double-grade-up", "/basildon-rayleigh-grade-up", "/basildon-students-grade-up", "/basildon-wants-you", "/belle-vue-baptist-church-dojo-is-a-go"),
  ...to("/news", "/belts-award-for-upminster-students", "/bkf-international-sheffield", "/bronze-medal-for-kobe-at-orleans-france", "/central-england-international-open-worcester", "/central-england-karate-championships-2023-frontier-update", "/central-england-karate-championships-worcester", "/challenge-yourself", "/congrats-to-rayleigh-student-brown-belt-1st-kyu", "/congratulations-sensei-scott-4th-dan", "/congratulations-to-kobe-yogarajah-on-his-selections-for-the-wkf-world-championships-in-poland", "/congratulations-to-sensei-jade-on-her-recent-3rd-dan-promotion", "/congratulations-to-upminster-students-on-their-recent-grading-success"),
  ...to("/news", "/covi-19-guideline-return", "/covid-19-risk-assessment", "/december-kumite-prep-training-rayleigh", "/division-1-3of3-who-topped-the-medal-table", "/division-2-3of3-who-topped-the-medal-table", "/do-you-have-what-it-takes-to-be-a-black-belt", "/double-gold-medalist-british-international-senior-champion-60kg-british-international-u21-60kg-champion", "/ekf-international-open-crystal-palace", "/ekf-kyu-grade-childrens-and-veterans-championships-2024", "/elite-squad-sessions", "/england-selection-for-jade-and-kobe", "/england-selection-for-kobe"),
  ...to("/news", "/february-general-kyu-grading-have-you-registered", "/february-grading-success", "/final-preparation-complete", "/final-super-champs-for-2022", "/forza-2023-karate-club-championshiops-rayleigh", "/forza-23-karate-championships-saturday-25th-november", "/forza-at-the-2024-bkf-4-nations", "/forza-general-grading-july", "/forza-grading-success", "/forza-invitational-karate-cup-division-1-results", "/forza-invitational-karate-cup-division-2-results", "/forza-invitational-karate-cup-event-2"),
  ...to("/news", "/forza-invitational-karate-cup-rayleigh", "/forza-kicks-off-2021-online", "/forza-online", "/forza-students-grade-up", "/france-orleans-karate-cup", "/friday-after-school-club-now-full", "/friday-success-for-forza", "/frontier-karate-association-7th-place-on-medal-table-out-of", "/frontier-karate-association-places-5th-at-the-2023-bkf-international-open", "/frontier-karate-association-squad-training", "/frontier-karate-association-training-rayleigh-dojo", "/general-kyu-grading-december"),
  ...to("/news", "/get-ready-for-the-next-sport-karate-coaching-session", "/girl-power-for-upminster", "/glasgow-inter-club-training-session", "/go-quintin-silver-medal-at-the-commonwealth-karate-club-championships", "/good-luck-kobe", "/grading-news-for-4-6-years-class", "/grading-news-for-upminster-junior-class", "/grading-results-are-in", "/grading-success-at-upminster", "/grading-success-for-july-graders", "/grading-success-for-our-beginners", "/grading-success-for-rayleigh-dojo"),
  ...to("/news", "/grading-success-for-rayleigh-dojo-tuesday", "/grading-success-for-rayleigh-primary-school-students-tuesday-class", "/grading-success-for-rps", "/grading-success-for-rps-saturday-club", "/grading-success-for-thorpe-bay", "/grading-success-for-upminster-karate-ka", "/grading-success-september", "/great-to-be-back-face-to-face-prep-training-for-kumite-resumes", "/happy-easter", "/happy-new-year-2022", "/hello-world", "/inter-club-with-our-friends-at-halifax-kempo-ryu"),
  ...to("/news", "/inter-club-with-the-talented-paul-campbells-karate-academy", "/jade-honeywood-receives-pauline-bindra-award-for-leadership-and-commercial-acumen-at-tukka-2024", "/january-prep-training", "/january-super-champs-training", "/jhka-3rd-open-championships-romford", "/jhka-5th-invitational-open-registrations-are-now-open", "/jhka-5th-open-championships", "/jhka-5th-open-championships-results", "/jhka-open-collier-row", "/jordan-thomas-kumite-class", "/july-grading-success", "/july-preparation-training"),
  ...to("/news", "/june-grading-success-at-forza", "/karate-legends-are-you-ready", "/kata-prep-training-25-2-23", "/kata-prep-training-3-1-of-3", "/kata-prep-training-january", "/kata-preparation-3-3", "/kata-preparation-chingford", "/kata-preparation-session-completed", "/kata-preparation-training", "/kata-preparation-training-2", "/kata-preparation-training-rayleigh", "/kata-preparation-training-with-sensei-hayley"),
  ...to("/news", "/kata-sport-karate-coaching", "/kata-team", "/kata-training-preparation", "/kicking-into-2023", "/kids-karate-classes-spaces-at-rayleigh-basildon-thorpe-bay-and-upminster", "/kobe-secures-a-bronze-medal-at-the-2022-commonwealth-karate-championships", "/kobe-selected-for-2026-commonwealth-karate-championships-scotland", "/kobe-selected-for-wkf-youth-league", "/kobe-takes-gold", "/kobe-wins-bronze-at-2023-ekf-national-championships-cannock", "/kobe-wins-gold-at-the-british-4-nations", "/kobe-wins-silver-at-e1-karate-series-male-junior-55kg"),
  ...to("/news", "/kobe-wins-silver-at-the-punok-dutch-youth-cup-holland", "/kumite-team", "/learn-karate-with-forza-register-today", "/learn-sport-karate-with-the-new-sport-karate-coaching", "/molly-samuel-leport-m-b-e-kumite-seminar", "/molly-samuel-leport-m-b-e-kumite-seminar-2", "/national-lockdown-update", "/new-class-opening-in-may-at-southend", "/new-date-available-for-the-next-preparation-training", "/new-dojo-and-new-belts-for-shoeburyness-dojo", "/niahm-junner-kumite-class", "/niamh-junner-kumite-class"),
  ...to("/news", "/niamh-junner-kumite-class-friday", "/no-extra-hour-at-after-school-class-at-rps-friday", "/october-december-grading-dates-are-out", "/ooosshhhaaa-prep-training-finishes-for-2023", "/orleans-international-selections", "/our-classes-re-open-13th-april-2021", "/our-dojos-are-closed-as-of-thursday-5th-november-until-2nd-december", "/our-new-superchamps-prep-training-is-here", "/para-karate-training-kickstarts-at-rayleigh-primary-school", "/please-register-by-9pm-the-day-before-your-wish-to-attend-class", "/pre-training-for-bkf-international-2024", "/prep-training-2-of-3-this-sunday-register-today"),
  ...to("/news", "/prep-training-for-next-event-completed", "/preparation-2-of-3-completed", "/preparation-training-2-kumite", "/preparation-training-2021", "/preparation-training-3-3", "/preparation-training-completed", "/preparation-training-kumite-2-3", "/preparation-training-rayleigh-15-09-24", "/preparation-training-saturday-kata", "/preparation-training-september", "/qg-makes-her-debut-in-croatia-pictured-with-olympic-champion-steven-da-costa-of-france", "/rayleigh-graders"),
  ...to("/news", "/rayleigh-primary-school-now-closed-until-tuesday-8th-june", "/rayleigh-primary-school-students-grade-up", "/rayleigh-students-grade-up", "/reminder-no-karate-at-rps", "/results-from-the-forza-karate-club-championships-2023", "/results-of-the-2021-annual-club-championships", "/rps-10yrs-below-class-grading-results", "/rps-11-yrs-plus-grading-success", "/rps-children-grade-up", "/rps-dojo-general-kyu-grading", "/rps-friday-and-thorpe-bay-grade-up", "/rps-friday-success"),
  ...to("/news", "/rps-saturday-morning-class-returns", "/sensei-anthoni-awarded-the-grade-of-6th-dan", "/skt-karate", "/smiles-lit-up-the-dojo-well-done-to-the-karate-ka-that-passed-their-belts", "/southern-england-regional-training-kent", "/special-guest-niamh-junner", "/sport-karate-coaching-kumite", "/sport-karate-coaching-registration", "/sport-karate-coaching-registration-2", "/sport-karate-coaching-session-in-kata", "/students-prepare-for-grading-in-3-weeks", "/success-at-the-2025-bkf-4-nations"),
  ...to("/news", "/success-for-forza-at-the-english-senior-karate-championships", "/super-champs-squad-prep-training", "/super-champs-success", "/super-champs-training-11-12pm-this-sunday-register-today", "/team-fka-squad-training", "/the-club-is-now-closed-until-1st-november", "/the-united-kingdom-karate-awards-23", "/thorpe-bay-general-kyu-grading", "/track-and-trace-form", "/track-and-trace-form-to-be-completed-up-to-48-hours-before-class", "/tuesday-classes-19-7-22-cancelled-due-to-the-extreme-weather", "/up-the-belts-at-upminster"),
  ...to("/news", "/upminster-belt-up", "/upminster-boys-grade-up", "/upminster-class-finishes-top-marks", "/upminster-dojo-invites-budding-karate-stars-of-the-future", "/upminster-students-awarded-their-new-belts-congratulations", "/upminster-students-grade-up", "/upminster-teens-and-advance-class", "/virtual-karate-classes-every-friday-6-30-7-15pm", "/virtual-training-grading", "/we-are-now-opening-recruitment-of-new-members", "/well-done-forza-at-our-recent-kyu-grading", "/well-done-sensei-jade-on-receiving-her-wkf-coaching-licence"),
  ...to("/news", "/wkf-youth-camp-cup-and-league-porec-croatia", "/wkf-youth-league-porec-croatia", "/world-karate-federation-youth-camp-and-cup", "/yogarajahs-at-the-central-england-international"),

  // → / (4)
  ...to("/", "/flyers", "/game", "/karate-game", "/welcome"),

  // → http://frontierkarateassociation.co.uk/ (1)
  ...to("http://frontierkarateassociation.co.uk/", "/frontier-karate-association"),

]
