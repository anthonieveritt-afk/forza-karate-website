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

  // → /news (index) (23) — old URLs with no matching imported post
  ...to("/news", "/1992-2", "/2012-2", "/2014-2", "/2014-christmas-presentation-evening", "/2015-club-championships-rayleigh-rps", "/2016-forza-club-championships", "/2023-super-champs", "/2024-team-fka-association-training", "/covi-19-guideline-return", "/covid-19-risk-assessment", "/elite-squad-sessions", "/forza-online"),
  ...to("/news", "/jhka-5th-open-championships", "/kata-team", "/kumite-team", "/niahm-junner-kumite-class", "/niamh-junner-kumite-class-friday", "/please-register-by-9pm-the-day-before-your-wish-to-attend-class", "/preparation-training-2021", "/skt-karate", "/sport-karate-coaching-registration", "/sport-karate-coaching-registration-2", "/track-and-trace-form"),
  // → /news/[slug] (209) — old WordPress post URLs to their imported story
  { source: "/2-bronze-for-forza-at-the-2025-ekf-senior-championships", destination: "/news/2-bronze-for-forza-at-the-2025-ekf-senior-championships", permanent: true },
  { source: "/2-bronze-medal-5th-place-for-forza-at-the-e1", destination: "/news/2-bronze-medal-5th-place-for-forza-at-the-e1", permanent: true },
  { source: "/2021-annual-club-competition", destination: "/news/2021-annual-club-competition", permanent: true },
  { source: "/2023_forza_karate_championships", destination: "/news/2023_forza_karate_championships", permanent: true },
  { source: "/2024-ekf-senior-championships-write-up", destination: "/news/2024-ekf-senior-championships-write-up", permanent: true },
  { source: "/2025-english-kyu-grade-karate-championships-sheffield", destination: "/news/2025-english-kyu-grade-karate-championships-sheffield", permanent: true },
  { source: "/357-2", destination: "/news/357-2", permanent: true },
  { source: "/4-forza-students-at-2023-bkf-championships-motherwell", destination: "/news/4-forza-students-at-2023-bkf-championships-motherwell", permanent: true },
  { source: "/5-gold-at-the-jhka-invitational", destination: "/news/5-gold-at-the-jhka-invitational", permanent: true },
  { source: "/5813-2", destination: "/news/5813-2", permanent: true },
  { source: "/5th-place-at-marseille-karate-open-for-yuan", destination: "/news/5th-place-at-marseille-karate-open-for-yuan", permanent: true },
  { source: "/6374-2", destination: "/news/6374-2", permanent: true },
  { source: "/6840-2", destination: "/news/6840-2", permanent: true },
  { source: "/6957-2", destination: "/news/6957-2", permanent: true },
  { source: "/a-new-brown-belt-in-our-ranks", destination: "/news/a-new-brown-belt-in-our-ranks", permanent: true },
  { source: "/active-essex-young-sport-award-winner", destination: "/news/active-essex-young-sport-award-winner", permanent: true },
  { source: "/adult-classes-interested", destination: "/news/adult-classes-interested", permanent: true },
  { source: "/after-school-class-grade-up", destination: "/news/after-school-class-grade-up", permanent: true },
  { source: "/after-school-club-belts-up", destination: "/news/after-school-club-belts-up", permanent: true },
  { source: "/april-kyu-grading", destination: "/news/april-kyu-grading", permanent: true },
  { source: "/association-squad-training-4th-march-rayleigh", destination: "/news/association-squad-training-4th-march-rayleigh", permanent: true },
  { source: "/association-squad-training-heathfield", destination: "/news/association-squad-training-heathfield", permanent: true },
  { source: "/basildon-dojo-grading-results", destination: "/news/basildon-dojo-grading-results", permanent: true },
  { source: "/basildon-double-grade-up", destination: "/news/basildon-double-grade-up", permanent: true },
  { source: "/basildon-rayleigh-grade-up", destination: "/news/basildon-rayleigh-grade-up", permanent: true },
  { source: "/basildon-students-grade-up", destination: "/news/basildon-students-grade-up", permanent: true },
  { source: "/basildon-wants-you", destination: "/news/basildon-wants-you", permanent: true },
  { source: "/belle-vue-baptist-church-dojo-is-a-go", destination: "/news/belle-vue-baptist-church-dojo-is-a-go", permanent: true },
  { source: "/belts-award-for-upminster-students", destination: "/news/belts-award-for-upminster-students", permanent: true },
  { source: "/bkf-international-sheffield", destination: "/news/bkf-international-sheffield", permanent: true },
  { source: "/bronze-medal-for-kobe-at-orleans-france", destination: "/news/bronze-medal-for-kobe-at-orleans-france", permanent: true },
  { source: "/central-england-international-open-worcester", destination: "/news/central-england-international-open-worcester", permanent: true },
  { source: "/central-england-karate-championships-2023-frontier-update", destination: "/news/central-england-karate-championships-2023-frontier-update", permanent: true },
  { source: "/central-england-karate-championships-worcester", destination: "/news/central-england-karate-championships-worcester", permanent: true },
  { source: "/challenge-yourself", destination: "/news/challenge-yourself", permanent: true },
  { source: "/congrats-to-rayleigh-student-brown-belt-1st-kyu", destination: "/news/congrats-to-rayleigh-student-brown-belt-1st-kyu", permanent: true },
  { source: "/congratulations-sensei-scott-4th-dan", destination: "/news/congratulations-sensei-scott-4th-dan", permanent: true },
  { source: "/congratulations-to-kobe-yogarajah-on-his-selections-for-the-wkf-world-championships-in-poland", destination: "/news/congratulations-to-kobe-yogarajah-on-his-selections-for-the-wkf-world-championships-in-poland", permanent: true },
  { source: "/congratulations-to-sensei-jade-on-her-recent-3rd-dan-promotion", destination: "/news/congratulations-to-sensei-jade-on-her-recent-3rd-dan-promotion", permanent: true },
  { source: "/congratulations-to-upminster-students-on-their-recent-grading-success", destination: "/news/congratulations-to-upminster-students-on-their-recent-grading-success", permanent: true },
  { source: "/december-kumite-prep-training-rayleigh", destination: "/news/december-kumite-prep-training-rayleigh", permanent: true },
  { source: "/division-1-3of3-who-topped-the-medal-table", destination: "/news/division-1-3of3-who-topped-the-medal-table", permanent: true },
  { source: "/division-2-3of3-who-topped-the-medal-table", destination: "/news/division-2-3of3-who-topped-the-medal-table", permanent: true },
  { source: "/do-you-have-what-it-takes-to-be-a-black-belt", destination: "/news/do-you-have-what-it-takes-to-be-a-black-belt", permanent: true },
  { source: "/double-gold-medalist-british-international-senior-champion-60kg-british-international-u21-60kg-champion", destination: "/news/double-gold-medalist-british-international-senior-champion-60kg-british-international-u21-60kg-champion", permanent: true },
  { source: "/ekf-international-open-crystal-palace", destination: "/news/ekf-international-open-crystal-palace", permanent: true },
  { source: "/ekf-kyu-grade-childrens-and-veterans-championships-2024", destination: "/news/ekf-kyu-grade-childrens-and-veterans-championships-2024", permanent: true },
  { source: "/england-selection-for-jade-and-kobe", destination: "/news/england-selection-for-jade-and-kobe", permanent: true },
  { source: "/england-selection-for-kobe", destination: "/news/england-selection-for-kobe", permanent: true },
  { source: "/february-general-kyu-grading-have-you-registered", destination: "/news/february-general-kyu-grading-have-you-registered", permanent: true },
  { source: "/february-grading-success", destination: "/news/february-grading-success", permanent: true },
  { source: "/final-preparation-complete", destination: "/news/final-preparation-complete", permanent: true },
  { source: "/final-super-champs-for-2022", destination: "/news/final-super-champs-for-2022", permanent: true },
  { source: "/forza-2023-karate-club-championshiops-rayleigh", destination: "/news/forza-2023-karate-club-championshiops-rayleigh", permanent: true },
  { source: "/forza-23-karate-championships-saturday-25th-november", destination: "/news/forza-23-karate-championships-saturday-25th-november", permanent: true },
  { source: "/forza-at-the-2024-bkf-4-nations", destination: "/news/forza-at-the-2024-bkf-4-nations", permanent: true },
  { source: "/forza-general-grading-july", destination: "/news/forza-general-grading-july", permanent: true },
  { source: "/forza-grading-success", destination: "/news/forza-grading-success", permanent: true },
  { source: "/forza-invitational-karate-cup-division-1-results", destination: "/news/forza-invitational-karate-cup-division-1-results", permanent: true },
  { source: "/forza-invitational-karate-cup-division-2-results", destination: "/news/forza-invitational-karate-cup-division-2-results", permanent: true },
  { source: "/forza-invitational-karate-cup-event-2", destination: "/news/forza-invitational-karate-cup-event-2", permanent: true },
  { source: "/forza-invitational-karate-cup-rayleigh", destination: "/news/forza-invitational-karate-cup-rayleigh", permanent: true },
  { source: "/forza-kicks-off-2021-online", destination: "/news/forza-kicks-off-2021-online", permanent: true },
  { source: "/forza-students-grade-up", destination: "/news/forza-students-grade-up", permanent: true },
  { source: "/france-orleans-karate-cup", destination: "/news/france-orleans-karate-cup", permanent: true },
  { source: "/friday-after-school-club-now-full", destination: "/news/friday-after-school-club-now-full", permanent: true },
  { source: "/friday-success-for-forza", destination: "/news/friday-success-for-forza", permanent: true },
  { source: "/frontier-karate-association-7th-place-on-medal-table-out-of", destination: "/news/frontier-karate-association-7th-place-on-medal-table-out-of", permanent: true },
  { source: "/frontier-karate-association-places-5th-at-the-2023-bkf-international-open", destination: "/news/frontier-karate-association-places-5th-at-the-2023-bkf-international-open", permanent: true },
  { source: "/frontier-karate-association-squad-training", destination: "/news/frontier-karate-association-squad-training", permanent: true },
  { source: "/frontier-karate-association-training-rayleigh-dojo", destination: "/news/frontier-karate-association-training-rayleigh-dojo", permanent: true },
  { source: "/general-kyu-grading-december", destination: "/news/general-kyu-grading-december", permanent: true },
  { source: "/get-ready-for-the-next-sport-karate-coaching-session", destination: "/news/get-ready-for-the-next-sport-karate-coaching-session", permanent: true },
  { source: "/girl-power-for-upminster", destination: "/news/girl-power-for-upminster", permanent: true },
  { source: "/glasgow-inter-club-training-session", destination: "/news/glasgow-inter-club-training-session", permanent: true },
  { source: "/go-quintin-silver-medal-at-the-commonwealth-karate-club-championships", destination: "/news/go-quintin-silver-medal-at-the-commonwealth-karate-club-championships", permanent: true },
  { source: "/good-luck-kobe", destination: "/news/good-luck-kobe", permanent: true },
  { source: "/grading-news-for-4-6-years-class", destination: "/news/grading-news-for-4-6-years-class", permanent: true },
  { source: "/grading-news-for-upminster-junior-class", destination: "/news/grading-news-for-upminster-junior-class", permanent: true },
  { source: "/grading-results-are-in", destination: "/news/grading-results-are-in", permanent: true },
  { source: "/grading-success-at-upminster", destination: "/news/grading-success-at-upminster", permanent: true },
  { source: "/grading-success-for-july-graders", destination: "/news/grading-success-for-july-graders", permanent: true },
  { source: "/grading-success-for-our-beginners", destination: "/news/grading-success-for-our-beginners", permanent: true },
  { source: "/grading-success-for-rayleigh-dojo", destination: "/news/grading-success-for-rayleigh-dojo", permanent: true },
  { source: "/grading-success-for-rayleigh-dojo-tuesday", destination: "/news/grading-success-for-rayleigh-dojo-tuesday", permanent: true },
  { source: "/grading-success-for-rayleigh-primary-school-students-tuesday-class", destination: "/news/grading-success-for-rayleigh-primary-school-students-tuesday-class", permanent: true },
  { source: "/grading-success-for-rps", destination: "/news/grading-success-for-rps", permanent: true },
  { source: "/grading-success-for-rps-saturday-club", destination: "/news/grading-success-for-rps-saturday-club", permanent: true },
  { source: "/grading-success-for-thorpe-bay", destination: "/news/grading-success-for-thorpe-bay", permanent: true },
  { source: "/grading-success-for-upminster-karate-ka", destination: "/news/grading-success-for-upminster-karate-ka", permanent: true },
  { source: "/grading-success-september", destination: "/news/grading-success-september", permanent: true },
  { source: "/great-to-be-back-face-to-face-prep-training-for-kumite-resumes", destination: "/news/great-to-be-back-face-to-face-prep-training-for-kumite-resumes", permanent: true },
  { source: "/happy-easter", destination: "/news/happy-easter", permanent: true },
  { source: "/happy-new-year-2022", destination: "/news/happy-new-year-2022", permanent: true },
  { source: "/hello-world", destination: "/news/hello-world", permanent: true },
  { source: "/inter-club-with-our-friends-at-halifax-kempo-ryu", destination: "/news/inter-club-with-our-friends-at-halifax-kempo-ryu", permanent: true },
  { source: "/inter-club-with-the-talented-paul-campbells-karate-academy", destination: "/news/inter-club-with-the-talented-paul-campbells-karate-academy", permanent: true },
  { source: "/jade-honeywood-receives-pauline-bindra-award-for-leadership-and-commercial-acumen-at-tukka-2024", destination: "/news/jade-honeywood-receives-pauline-bindra-award-for-leadership-and-commercial-acumen-at-tukka-2024", permanent: true },
  { source: "/january-prep-training", destination: "/news/january-prep-training", permanent: true },
  { source: "/january-super-champs-training", destination: "/news/january-super-champs-training", permanent: true },
  { source: "/jhka-3rd-open-championships-romford", destination: "/news/jhka-3rd-open-championships-romford", permanent: true },
  { source: "/jhka-5th-invitational-open-registrations-are-now-open", destination: "/news/jhka-5th-invitational-open-registrations-are-now-open", permanent: true },
  { source: "/jhka-5th-open-championships-results", destination: "/news/jhka-5th-open-championships-results", permanent: true },
  { source: "/jhka-open-collier-row", destination: "/news/jhka-open-collier-row", permanent: true },
  { source: "/jordan-thomas-kumite-class", destination: "/news/jordan-thomas-kumite-class", permanent: true },
  { source: "/july-grading-success", destination: "/news/july-grading-success", permanent: true },
  { source: "/july-preparation-training", destination: "/news/july-preparation-training", permanent: true },
  { source: "/june-grading-success-at-forza", destination: "/news/june-grading-success-at-forza", permanent: true },
  { source: "/karate-legends-are-you-ready", destination: "/news/karate-legends-are-you-ready", permanent: true },
  { source: "/kata-prep-training-25-2-23", destination: "/news/kata-prep-training-25-2-23", permanent: true },
  { source: "/kata-prep-training-3-1-of-3", destination: "/news/kata-prep-training-3-1-of-3", permanent: true },
  { source: "/kata-prep-training-january", destination: "/news/kata-prep-training-january", permanent: true },
  { source: "/kata-preparation-3-3", destination: "/news/kata-preparation-3-3", permanent: true },
  { source: "/kata-preparation-chingford", destination: "/news/kata-preparation-chingford", permanent: true },
  { source: "/kata-preparation-session-completed", destination: "/news/kata-preparation-session-completed", permanent: true },
  { source: "/kata-preparation-training", destination: "/news/kata-preparation-training", permanent: true },
  { source: "/kata-preparation-training-2", destination: "/news/kata-preparation-training-2", permanent: true },
  { source: "/kata-preparation-training-rayleigh", destination: "/news/kata-preparation-training-rayleigh", permanent: true },
  { source: "/kata-preparation-training-with-sensei-hayley", destination: "/news/kata-preparation-training-with-sensei-hayley", permanent: true },
  { source: "/kata-sport-karate-coaching", destination: "/news/kata-sport-karate-coaching", permanent: true },
  { source: "/kata-training-preparation", destination: "/news/kata-training-preparation", permanent: true },
  { source: "/kicking-into-2023", destination: "/news/kicking-into-2023", permanent: true },
  { source: "/kids-karate-classes-spaces-at-rayleigh-basildon-thorpe-bay-and-upminster", destination: "/news/kids-karate-classes-spaces-at-rayleigh-basildon-thorpe-bay-and-upminster", permanent: true },
  { source: "/kobe-secures-a-bronze-medal-at-the-2022-commonwealth-karate-championships", destination: "/news/kobe-secures-a-bronze-medal-at-the-2022-commonwealth-karate-championships", permanent: true },
  { source: "/kobe-selected-for-2026-commonwealth-karate-championships-scotland", destination: "/news/kobe-selected-for-2026-commonwealth-karate-championships-scotland", permanent: true },
  { source: "/kobe-selected-for-wkf-youth-league", destination: "/news/kobe-selected-for-wkf-youth-league", permanent: true },
  { source: "/kobe-takes-gold", destination: "/news/kobe-takes-gold", permanent: true },
  { source: "/kobe-wins-bronze-at-2023-ekf-national-championships-cannock", destination: "/news/kobe-wins-bronze-at-2023-ekf-national-championships-cannock", permanent: true },
  { source: "/kobe-wins-gold-at-the-british-4-nations", destination: "/news/kobe-wins-gold-at-the-british-4-nations", permanent: true },
  { source: "/kobe-wins-silver-at-e1-karate-series-male-junior-55kg", destination: "/news/kobe-wins-silver-at-e1-karate-series-male-junior-55kg", permanent: true },
  { source: "/kobe-wins-silver-at-the-punok-dutch-youth-cup-holland", destination: "/news/kobe-wins-silver-at-the-punok-dutch-youth-cup-holland", permanent: true },
  { source: "/learn-karate-with-forza-register-today", destination: "/news/learn-karate-with-forza-register-today", permanent: true },
  { source: "/learn-sport-karate-with-the-new-sport-karate-coaching", destination: "/news/learn-sport-karate-with-the-new-sport-karate-coaching", permanent: true },
  { source: "/molly-samuel-leport-m-b-e-kumite-seminar", destination: "/news/molly-samuel-leport-m-b-e-kumite-seminar", permanent: true },
  { source: "/molly-samuel-leport-m-b-e-kumite-seminar-2", destination: "/news/molly-samuel-leport-m-b-e-kumite-seminar-2", permanent: true },
  { source: "/national-lockdown-update", destination: "/news/national-lockdown-update", permanent: true },
  { source: "/new-class-opening-in-may-at-southend", destination: "/news/new-class-opening-in-may-at-southend", permanent: true },
  { source: "/new-date-available-for-the-next-preparation-training", destination: "/news/new-date-available-for-the-next-preparation-training", permanent: true },
  { source: "/new-dojo-and-new-belts-for-shoeburyness-dojo", destination: "/news/new-dojo-and-new-belts-for-shoeburyness-dojo", permanent: true },
  { source: "/niamh-junner-kumite-class", destination: "/news/niamh-junner-kumite-class", permanent: true },
  { source: "/no-extra-hour-at-after-school-class-at-rps-friday", destination: "/news/no-extra-hour-at-after-school-class-at-rps-friday", permanent: true },
  { source: "/october-december-grading-dates-are-out", destination: "/news/october-december-grading-dates-are-out", permanent: true },
  { source: "/ooosshhhaaa-prep-training-finishes-for-2023", destination: "/news/ooosshhhaaa-prep-training-finishes-for-2023", permanent: true },
  { source: "/orleans-international-selections", destination: "/news/orleans-international-selections", permanent: true },
  { source: "/our-classes-re-open-13th-april-2021", destination: "/news/our-classes-re-open-13th-april-2021", permanent: true },
  { source: "/our-dojos-are-closed-as-of-thursday-5th-november-until-2nd-december", destination: "/news/our-dojos-are-closed-as-of-thursday-5th-november-until-2nd-december", permanent: true },
  { source: "/our-new-superchamps-prep-training-is-here", destination: "/news/our-new-superchamps-prep-training-is-here", permanent: true },
  { source: "/para-karate-training-kickstarts-at-rayleigh-primary-school", destination: "/news/para-karate-training-kickstarts-at-rayleigh-primary-school", permanent: true },
  { source: "/pre-training-for-bkf-international-2024", destination: "/news/pre-training-for-bkf-international-2024", permanent: true },
  { source: "/prep-training-2-of-3-this-sunday-register-today", destination: "/news/prep-training-2-of-3-this-sunday-register-today", permanent: true },
  { source: "/prep-training-for-next-event-completed", destination: "/news/prep-training-for-next-event-completed", permanent: true },
  { source: "/preparation-2-of-3-completed", destination: "/news/preparation-2-of-3-completed", permanent: true },
  { source: "/preparation-training-2-kumite", destination: "/news/preparation-training-2-kumite", permanent: true },
  { source: "/preparation-training-3-3", destination: "/news/preparation-training-3-3", permanent: true },
  { source: "/preparation-training-completed", destination: "/news/preparation-training-completed", permanent: true },
  { source: "/preparation-training-kumite-2-3", destination: "/news/preparation-training-kumite-2-3", permanent: true },
  { source: "/preparation-training-rayleigh-15-09-24", destination: "/news/preparation-training-rayleigh-15-09-24", permanent: true },
  { source: "/preparation-training-saturday-kata", destination: "/news/preparation-training-saturday-kata", permanent: true },
  { source: "/preparation-training-september", destination: "/news/preparation-training-september", permanent: true },
  { source: "/qg-makes-her-debut-in-croatia-pictured-with-olympic-champion-steven-da-costa-of-france", destination: "/news/qg-makes-her-debut-in-croatia-pictured-with-olympic-champion-steven-da-costa-of-france", permanent: true },
  { source: "/rayleigh-graders", destination: "/news/rayleigh-graders", permanent: true },
  { source: "/rayleigh-primary-school-now-closed-until-tuesday-8th-june", destination: "/news/rayleigh-primary-school-now-closed-until-tuesday-8th-june", permanent: true },
  { source: "/rayleigh-primary-school-students-grade-up", destination: "/news/rayleigh-primary-school-students-grade-up", permanent: true },
  { source: "/rayleigh-students-grade-up", destination: "/news/rayleigh-students-grade-up", permanent: true },
  { source: "/reminder-no-karate-at-rps", destination: "/news/reminder-no-karate-at-rps", permanent: true },
  { source: "/results-from-the-forza-karate-club-championships-2023", destination: "/news/results-from-the-forza-karate-club-championships-2023", permanent: true },
  { source: "/results-of-the-2021-annual-club-championships", destination: "/news/results-of-the-2021-annual-club-championships", permanent: true },
  { source: "/rps-10yrs-below-class-grading-results", destination: "/news/rps-10yrs-below-class-grading-results", permanent: true },
  { source: "/rps-11-yrs-plus-grading-success", destination: "/news/rps-11-yrs-plus-grading-success", permanent: true },
  { source: "/rps-children-grade-up", destination: "/news/rps-children-grade-up", permanent: true },
  { source: "/rps-dojo-general-kyu-grading", destination: "/news/rps-dojo-general-kyu-grading", permanent: true },
  { source: "/rps-friday-and-thorpe-bay-grade-up", destination: "/news/rps-friday-and-thorpe-bay-grade-up", permanent: true },
  { source: "/rps-friday-success", destination: "/news/rps-friday-success", permanent: true },
  { source: "/rps-saturday-morning-class-returns", destination: "/news/rps-saturday-morning-class-returns", permanent: true },
  { source: "/sensei-anthoni-awarded-the-grade-of-6th-dan", destination: "/news/sensei-anthoni-awarded-the-grade-of-6th-dan", permanent: true },
  { source: "/smiles-lit-up-the-dojo-well-done-to-the-karate-ka-that-passed-their-belts", destination: "/news/smiles-lit-up-the-dojo-well-done-to-the-karate-ka-that-passed-their-belts", permanent: true },
  { source: "/southern-england-regional-training-kent", destination: "/news/southern-england-regional-training-kent", permanent: true },
  { source: "/special-guest-niamh-junner", destination: "/news/special-guest-niamh-junner", permanent: true },
  { source: "/sport-karate-coaching-kumite", destination: "/news/sport-karate-coaching-kumite", permanent: true },
  { source: "/sport-karate-coaching-session-in-kata", destination: "/news/sport-karate-coaching-session-in-kata", permanent: true },
  { source: "/students-prepare-for-grading-in-3-weeks", destination: "/news/students-prepare-for-grading-in-3-weeks", permanent: true },
  { source: "/success-at-the-2025-bkf-4-nations", destination: "/news/success-at-the-2025-bkf-4-nations", permanent: true },
  { source: "/success-for-forza-at-the-english-senior-karate-championships", destination: "/news/success-for-forza-at-the-english-senior-karate-championships", permanent: true },
  { source: "/super-champs-squad-prep-training", destination: "/news/super-champs-squad-prep-training", permanent: true },
  { source: "/super-champs-success", destination: "/news/super-champs-success", permanent: true },
  { source: "/super-champs-training-11-12pm-this-sunday-register-today", destination: "/news/super-champs-training-11-12pm-this-sunday-register-today", permanent: true },
  { source: "/team-fka-squad-training", destination: "/news/team-fka-squad-training", permanent: true },
  { source: "/the-club-is-now-closed-until-1st-november", destination: "/news/the-club-is-now-closed-until-1st-november", permanent: true },
  { source: "/the-united-kingdom-karate-awards-23", destination: "/news/the-united-kingdom-karate-awards-23", permanent: true },
  { source: "/thorpe-bay-general-kyu-grading", destination: "/news/thorpe-bay-general-kyu-grading", permanent: true },
  { source: "/track-and-trace-form-to-be-completed-up-to-48-hours-before-class", destination: "/news/track-and-trace-form-to-be-completed-up-to-48-hours-before-class", permanent: true },
  { source: "/tuesday-classes-19-7-22-cancelled-due-to-the-extreme-weather", destination: "/news/tuesday-classes-19-7-22-cancelled-due-to-the-extreme-weather", permanent: true },
  { source: "/up-the-belts-at-upminster", destination: "/news/up-the-belts-at-upminster", permanent: true },
  { source: "/upminster-belt-up", destination: "/news/upminster-belt-up", permanent: true },
  { source: "/upminster-boys-grade-up", destination: "/news/upminster-boys-grade-up", permanent: true },
  { source: "/upminster-class-finishes-top-marks", destination: "/news/upminster-class-finishes-top-marks", permanent: true },
  { source: "/upminster-dojo-invites-budding-karate-stars-of-the-future", destination: "/news/upminster-dojo-invites-budding-karate-stars-of-the-future", permanent: true },
  { source: "/upminster-students-awarded-their-new-belts-congratulations", destination: "/news/upminster-students-awarded-their-new-belts-congratulations", permanent: true },
  { source: "/upminster-students-grade-up", destination: "/news/upminster-students-grade-up", permanent: true },
  { source: "/upminster-teens-and-advance-class", destination: "/news/upminster-teens-and-advance-class", permanent: true },
  { source: "/virtual-karate-classes-every-friday-6-30-7-15pm", destination: "/news/virtual-karate-classes-every-friday-6-30-7-15pm", permanent: true },
  { source: "/virtual-training-grading", destination: "/news/virtual-training-grading", permanent: true },
  { source: "/we-are-now-opening-recruitment-of-new-members", destination: "/news/we-are-now-opening-recruitment-of-new-members", permanent: true },
  { source: "/well-done-forza-at-our-recent-kyu-grading", destination: "/news/well-done-forza-at-our-recent-kyu-grading", permanent: true },
  { source: "/well-done-sensei-jade-on-receiving-her-wkf-coaching-licence", destination: "/news/well-done-sensei-jade-on-receiving-her-wkf-coaching-licence", permanent: true },
  { source: "/wkf-youth-camp-cup-and-league-porec-croatia", destination: "/news/wkf-youth-camp-cup-and-league-porec-croatia", permanent: true },
  { source: "/wkf-youth-league-porec-croatia", destination: "/news/wkf-youth-league-porec-croatia", permanent: true },
  { source: "/world-karate-federation-youth-camp-and-cup", destination: "/news/world-karate-federation-youth-camp-and-cup", permanent: true },
  { source: "/yogarajahs-at-the-central-england-international", destination: "/news/yogarajahs-at-the-central-england-international", permanent: true },

  // imported posts not seen in the crawl


  // → / (4)
  ...to("/", "/flyers", "/game", "/karate-game", "/welcome"),

  // → http://frontierkarateassociation.co.uk/ (1)
  ...to("http://frontierkarateassociation.co.uk/", "/frontier-karate-association"),

]
