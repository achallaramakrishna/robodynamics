export interface HindiChallengeQuestion {
  id: string;
  type: "MEANING" | "GRAMMAR" | "DIALECT" | "LITERARY";
  prompt: string;
  options: string[];
  answer: string;
  idealSeconds: number;
  grade: string;
  image?: string;
}

export const hindiChallengePool: HindiChallengeQuestion[] = [
  // --- GRADE 1 --- (Basic Objects, Family, Colors)
  { id: "G1_1", grade: "Grade 1", type: "MEANING", prompt: "Hindi for 'Apple'?", options: ["Seb", "Aam", "Kela", "Santra"], answer: "Seb", idealSeconds: 3, image: "/apple.png" },
  { id: "G1_2", grade: "Grade 1", type: "MEANING", prompt: "What is 'Ghar'?", options: ["House", "Tree", "Bird", "Road"], answer: "House", idealSeconds: 3, image: "/house.png" },
  { id: "G1_3", grade: "Grade 1", type: "MEANING", prompt: "Hindi for 'Water'?", options: ["Doodh", "Paani", "Chai", "Roti"], answer: "Paani", idealSeconds: 3 },
  { id: "G1_4", grade: "Grade 1", type: "MEANING", prompt: "Color of 'Kala'?", options: ["Red", "White", "Black", "Blue"], answer: "Black", idealSeconds: 3 },
  { id: "G1_5", grade: "Grade 1", type: "MEANING", prompt: "Hindi for 'Mother'?", options: ["Papa", "Mummy/Maa", "Bhai", "Dada"], answer: "Mummy/Maa", idealSeconds: 3 },
  { id: "G1_6", grade: "Grade 1", type: "MEANING", prompt: "What is 'Kitab'?", options: ["Pen", "Book", "Table", "Chair"], answer: "Book", idealSeconds: 4 },
  { id: "G1_7", grade: "Grade 1", type: "MEANING", prompt: "Hindi for 'Sun'?", options: ["Chand", "Suraj", "Taare", "Megh"], answer: "Suraj", idealSeconds: 3, image: "/sun.png" },
  { id: "G1_8", grade: "Grade 1", type: "MEANING", prompt: "What is 'Aam'?", options: ["Banana", "Apple", "Mango", "Pear"], answer: "Mango", idealSeconds: 3, image: "/mango.png" },
  { id: "G1_9", grade: "Grade 1", type: "MEANING", prompt: "Color of 'Hara'?", options: ["Green", "Pink", "Yellow", "Red"], answer: "Green", idealSeconds: 3 },
  { id: "G1_10", grade: "Grade 1", type: "MEANING", prompt: "Hindi for 'Bird'?", options: ["Sher", "Chidiya", "Chuha", "Bandar"], answer: "Chidiya", idealSeconds: 4, image: "/bird.png" },

  // --- GRADE 2 --- (Simple Actions, Opposites, Body Parts)
  { id: "G2_1", grade: "Grade 2", type: "MEANING", prompt: "Hindi for 'Hand'?", options: ["Naak", "Haath", "Aankh", "Kaan"], answer: "Haath", idealSeconds: 4 },
  { id: "G2_2", grade: "Grade 2", type: "GRAMMAR", prompt: "Opposite of 'Bada' (Big)?", options: ["Chhota", "Lamba", "Mota", "Patla"], answer: "Chhota", idealSeconds: 3 },
  { id: "G2_3", grade: "Grade 2", type: "MEANING", prompt: "Action of 'Khana'?", options: ["To Sleep", "To Eat", "To Run", "To Read"], answer: "To Eat", idealSeconds: 3 },
  { id: "G2_4", grade: "Grade 2", type: "MEANING", prompt: "Hindi for 'Dog'?", options: ["Billi", "Kutta", "Gai", "Bhais"], answer: "Kutta", idealSeconds: 3 },
  { id: "G2_5", grade: "Grade 2", type: "MEANING", prompt: "Meaning of 'Subah'?", options: ["Evening", "Morning", "Night", "Afternoon"], answer: "Morning", idealSeconds: 3 },
  { id: "G2_6", grade: "Grade 2", type: "MEANING", prompt: "Hindi for 'School'?", options: ["Aspatal", "Vidyalay", "Bazaar", "Mandir"], answer: "Vidyalay", idealSeconds: 4 },
  { id: "G2_7", grade: "Grade 2", type: "MEANING", prompt: "Action of 'Hassna'?", options: ["To Cry", "To Laugh", "To Jump", "To Sit"], answer: "To Laugh", idealSeconds: 3 },
  { id: "G2_8", grade: "Grade 2", type: "MEANING", prompt: "Hindi for 'Eye'?", options: ["Kaan", "Aankh", "Naak", "Jeebh"], answer: "Aankh", idealSeconds: 3 },
  { id: "G2_9", grade: "Grade 2", type: "GRAMMAR", prompt: "Opposite of 'Upar' (Up)?", options: ["Niche", "Aage", "Piche", "Bahar"], answer: "Niche", idealSeconds: 3 },
  { id: "G2_10", grade: "Grade 2", type: "MEANING", prompt: "Hindi for 'Bread'?", options: ["Chawal", "Roti", "Dal", "Sabzi"], answer: "Roti", idealSeconds: 3 },

  // --- GRADE 3 --- (Counting, Family Relations, Common Nouns)
  { id: "G3_1", grade: "Grade 3", type: "MEANING", prompt: "Hindi for 'Ten' (10)?", options: ["Do", "Dus", "Sau", "Ek"], answer: "Dus", idealSeconds: 3 },
  { id: "G3_2", grade: "Grade 3", type: "MEANING", prompt: "Meaning of 'Mitra'?", options: ["Enemy", "Friend", "Teacher", "Guest"], answer: "Friend", idealSeconds: 3 },
  { id: "G3_3", grade: "Grade 3", type: "GRAMMAR", prompt: "Gender of 'Ladka' (Boy)?", options: ["Pulling", "Streeling", "Napunsakling", "None"], answer: "Pulling", idealSeconds: 4 },
  { id: "G3_4", grade: "Grade 3", type: "MEANING", prompt: "Hindi for 'Sunday'?", options: ["Somvar", "Ravirvar", "Shanivbar", "Mangalvar"], answer: "Somvar", idealSeconds: 4 },
  { id: "G3_5", grade: "Grade 3", type: "MEANING", prompt: "What is 'Chidiya-ghar'?", options: ["School", "Zoo", "Garden", "Library"], answer: "Zoo", idealSeconds: 5 },
  { id: "G3_6", grade: "Grade 3", type: "MEANING", prompt: "Hindi for 'Grandmother' (Father's side)?", options: ["Nani", "Dadi", "Mami", "Bua"], answer: "Dadi", idealSeconds: 4 },
  { id: "G3_7", grade: "Grade 3", type: "MEANING", prompt: "Meaning of 'Bazaar'?", options: ["Field", "Market", "House", "Road"], answer: "Market", idealSeconds: 3 },
  { id: "G3_8", grade: "Grade 3", type: "MEANING", prompt: "Hindi for 'Seven' (7)?", options: ["Chhe", "Saat", "Aath", "Nau"], answer: "Saat", idealSeconds: 3 },
  { id: "G3_9", grade: "Grade 3", type: "GRAMMAR", prompt: "Plural of 'Kitaab'?", options: ["Kitaaben", "Kitaabo", "Kitaabe", "Kitaabi"], answer: "Kitaaben", idealSeconds: 4 },
  { id: "G3_10", grade: "Grade 3", type: "MEANING", prompt: "Meaning of 'Agni'?", options: ["Air", "Water", "Fire", "Earth"], answer: "Fire", idealSeconds: 3 },

  // --- GRADE 4 --- (Nouns, Simple Adjectives, Everyday Sentences)
  { id: "G4_1", grade: "Grade 4", type: "GRAMMAR", prompt: "Which is a 'Sangya' (Noun)?", options: ["Billi", "Sundar", "Bhavan", "Billi & Bhavan"], answer: "Billi & Bhavan", idealSeconds: 5 },
  { id: "G4_2", grade: "Grade 4", type: "MEANING", prompt: "Meaning of 'Prakash'?", options: ["Darkness", "Light", "Wind", "Mountain"], answer: "Light", idealSeconds: 4 },
  { id: "G4_3", grade: "Grade 4", type: "GRAMMAR", prompt: "Correct sentence: 'I am playing'?", options: ["Main khel raha hoon", "Main khel rahi hain", "Main khelta hoon", "Main khelo"], answer: "Main khel raha hoon", idealSeconds: 5 },
  { id: "G4_4", grade: "Grade 4", type: "MEANING", prompt: "Meaning of 'Yatra'?", options: ["Stay", "Journey", "Sleep", "Food"], answer: "Journey", idealSeconds: 4 },
  { id: "G4_5", grade: "Grade 4", type: "GRAMMAR", prompt: "Opposite of 'Garmi'?", options: ["Sardi", "Dhup", "Varsha", "Pawan"], answer: "Sardi", idealSeconds: 3 },
  { id: "G4_6", grade: "Grade 4", type: "MEANING", prompt: "Hindi for 'Clean'?", options: ["Ganda", "Saaf", "Bura", "Achha"], answer: "Saaf", idealSeconds: 3 },
  { id: "G4_7", grade: "Grade 4", type: "GRAMMAR", prompt: "Identify the 'Visheshan' (Adjective)?", options: ["Meetha", "Seb", "Khana", "Main"], answer: "Meetha", idealSeconds: 4 },
  { id: "G4_8", grade: "Grade 4", type: "MEANING", prompt: "Meaning of 'Koshish'?", options: ["Success", "Effort/Try", "Failure", "Lazy"], answer: "Effort/Try", idealSeconds: 4 },
  { id: "G4_9", grade: "Grade 4", type: "GRAMMAR", prompt: "Plural of 'Kalam' (Pen)?", options: ["Kalame", "Kalamon", "Kalamen", "Kalama"], answer: "Kalamen", idealSeconds: 4 },
  { id: "G4_10", grade: "Grade 4", type: "MEANING", prompt: "Meaning of 'Pratidin'?", options: ["Yesterday", "Tomorrow", "Daily", "Weekly"], answer: "Daily", idealSeconds: 4 },

  // --- GRADE 5 --- (Pronouns, Simple Tenses, Vocabulary Expansion)
  { id: "G5_1", grade: "Grade 5", type: "GRAMMAR", prompt: "Which is a 'Sarvanam' (Pronoun)?", options: ["Vah", "Ghar", "Sundar", "Hathi"], answer: "Vah", idealSeconds: 4 },
  { id: "G5_2", grade: "Grade 5", type: "MEANING", prompt: "Synonym (Paryayvachi) of 'Akash'?", options: ["Gagan", "Prithvi", "Paani", "Vayu"], answer: "Gagan", idealSeconds: 5 },
  { id: "G5_3", grade: "Grade 5", type: "GRAMMAR", prompt: "Past tense of 'Khelna' (To play)?", options: ["Khela", "Khelega", "Khel raha hai", "Khelte hain"], answer: "Khela", idealSeconds: 5 },
  { id: "G5_4", grade: "Grade 5", type: "MEANING", prompt: "Meaning of 'Samachar'?", options: ["Food", "News", "Travel", "Game"], answer: "News", idealSeconds: 4 },
  { id: "G5_5", grade: "Grade 5", type: "GRAMMAR", prompt: "Opposite of 'Sukhi'?", options: ["Khush", "Dukhi", "Shant", "Ragi"], answer: "Dukhi", idealSeconds: 3 },
  { id: "G5_6", grade: "Grade 5", type: "MEANING", prompt: "Meaning of 'Prayas'?", options: ["Rest", "Try/Attempt", "Done", "Now"], answer: "Try/Attempt", idealSeconds: 4 },
  { id: "G5_7", grade: "Grade 5", type: "GRAMMAR", prompt: "Identify the Verb (Kriya)?", options: ["Ram", "Daudna (To run)", "Sundar", "Dhima"], answer: "Daudna (To run)", idealSeconds: 4 },
  { id: "G5_8", grade: "Grade 5", type: "MEANING", prompt: "Meaning of 'Sadaiv'?", options: ["Never", "Always", "Sometimes", "Often"], answer: "Always", idealSeconds: 4 },
  { id: "G5_9", grade: "Grade 5", type: "GRAMMAR", prompt: "Synonym of 'Suraj'?", options: ["Dinkar", "Shashi", "Niraj", "Ambar"], answer: "Dinkar", idealSeconds: 5 },
  { id: "G5_10", grade: "Grade 5", type: "MEANING", prompt: "Meaning of 'Vidyalay'?", options: ["Hospital", "School", "Temple", "Forest"], answer: "School", idealSeconds: 3 },

  // --- GRADE 6 --- (Sentence Structure, Case Markers, Basic Literature)
  { id: "G6_1", grade: "Grade 6", type: "GRAMMAR", prompt: "Identify 'Karak' in 'Ram ne kitaba padhi'?", options: ["Karta", "Karm", "Karan", "Sampradan"], answer: "Karta", idealSeconds: 6 },
  { id: "G6_2", grade: "Grade 6", type: "MEANING", prompt: "Meaning of 'Matribhumi'?", options: ["Motherland", "Nature", "Sky", "Ocean"], answer: "Motherland", idealSeconds: 5 },
  { id: "G6_3", grade: "Grade 6", type: "LITERARY", prompt: "Who is the poet of 'Premchand' context?", options: ["Premchand", "Dinkar", "Pant", "Tulsi"], answer: "Premchand", idealSeconds: 7 },
  { id: "G6_4", grade: "Grade 6", type: "MEANING", prompt: "Synonym of 'Amrit'?", options: ["Vish", "Sudha", "Jal", "Pawan"], answer: "Sudha", idealSeconds: 5 },
  { id: "G6_5", grade: "Grade 6", type: "GRAMMAR", prompt: "Opposite of 'Uchit'?", options: ["Anuchit", "Sahi", "Bura", "Lagbhag"], answer: "Anuchit", idealSeconds: 4 },
  { id: "G6_6", grade: "Grade 6", type: "MEANING", prompt: "Meaning of 'Parishram'?", options: ["Hard work", "Rest", "Smart", "Win"], answer: "Hard work", idealSeconds: 4 },
  { id: "G6_7", grade: "Grade 6", type: "GRAMMAR", prompt: "Identify the Adverb (Kriya-Visheshan)?", options: ["Dhire (Slowly)", "Hathi", "Sundar", "Main"], answer: "Dhire (Slowly)", idealSeconds: 5 },
  { id: "G6_8", grade: "Grade 6", type: "MEANING", prompt: "Meaning of 'Agya'?", options: ["Request", "Order/Command", "Question", "Answer"], answer: "Order/Command", idealSeconds: 5 },
  { id: "G6_9", grade: "Grade 6", type: "GRAMMAR", prompt: "Identify 'Pulling' word?", options: ["Hava", "Ped (Tree)", "Nadi", "Kitab"], answer: "Ped (Tree)", idealSeconds: 5 },
  { id: "G6_10", grade: "Grade 6", type: "MEANING", prompt: "Meaning of 'Gaurav'?", options: ["Pride/Glory", "Fear", "Shame", "Anger"], answer: "Pride/Glory", idealSeconds: 5 },

  // --- GRADE 7 --- (Compound Words, Advanced Tenses, Prose Theme)
  { id: "G7_1", grade: "Grade 7", type: "GRAMMAR", prompt: "Meaning of 'Upasarg' (Prefix)?", options: ["Word added at front", "Word added at back", "Root word", "Sentence"], answer: "Word added at front", idealSeconds: 6 },
  { id: "G7_2", grade: "Grade 7", type: "MEANING", prompt: "Synonym of 'Prithvi'?", options: ["Dharti", "Ambar", "Neer", "Vayu"], answer: "Dharti", idealSeconds: 5 },
  { id: "G7_3", grade: "Grade 7", type: "GRAMMAR", prompt: "Identify 'Sanyukt Vakyat'?", options: ["And/Aur usage", "Simple sentence", "One clause", "None"], answer: "And/Aur usage", idealSeconds: 7 },
  { id: "G7_4", grade: "Grade 7", type: "MEANING", prompt: "Meaning of 'Swatantrata'?", options: ["Freedom", "Equality", "Justice", "Peace"], answer: "Freedom", idealSeconds: 4 },
  { id: "G7_5", grade: "Grade 7", type: "GRAMMAR", prompt: "Opposite of 'Aasha'?", options: ["Nirasha", "Sukh", "Shanti", "Utsah"], answer: "Nirasha", idealSeconds: 4 },
  { id: "G7_6", grade: "Grade 7", type: "MEANING", prompt: "Synonym of 'Sagar'?", options: ["Nadi", "Samudra", "Pahad", "Maidan"], answer: "Samudra", idealSeconds: 4 },
  { id: "G7_7", grade: "Grade 7", type: "GRAMMAR", prompt: "Gender of 'Nadi'?", options: ["Pulling", "Streeling", "Napunsak", "None"], answer: "Streeling", idealSeconds: 4 },
  { id: "G7_8", grade: "Grade 7", type: "MEANING", prompt: "Meaning of 'Utsav'?", options: ["Grief", "Festival", "Work", "Sleep"], answer: "Festival", idealSeconds: 4 },
  { id: "G7_9", grade: "Grade 7", type: "GRAMMAR", prompt: "Antonym of 'Pratyaksh'?", options: ["Paroksh", "Shubh", "Samyak", "Gyan"], answer: "Paroksh", idealSeconds: 6 },
  { id: "G7_10", grade: "Grade 7", type: "MEANING", prompt: "Meaning of 'Sarvatra'?", options: ["Nowhere", "Everywhere", "Somewhere", "Here"], answer: "Everywhere", idealSeconds: 5 },

  // --- GRADE 8 --- (Idioms, Complex Sentences, Major Authors)
  { id: "G8_1", grade: "Grade 8", type: "GRAMMAR", prompt: "Meaning of idiom 'Aakhon ka tara'?", options: ["Bright light", "Very dear", "Blind", "Angry"], answer: "Very dear", idealSeconds: 6 },
  { id: "G8_2", grade: "Grade 8", type: "MEANING", prompt: "Synonym of 'Pawan'?", options: ["Vayu", "Jal", "Agni", "Bhumi"], answer: "Vayu", idealSeconds: 5 },
  { id: "G8_3", grade: "Grade 8", type: "LITERARY", prompt: "Who is the author of 'Godan'?", options: ["Premchand", "Prasad", "Nirala", "Pant"], answer: "Premchand", idealSeconds: 8 },
  { id: "G8_4", grade: "Grade 8", type: "GRAMMAR", prompt: "Meaning of 'Muhavra'?", options: ["Proverb", "Idiom", "Grammar", "Poem"], answer: "Idiom", idealSeconds: 5 },
  { id: "G8_5", grade: "Grade 8", type: "MEANING", prompt: "Meaning of 'Nidaan'?", options: ["Diagnosis/Solution", "Gift", "Sleep", "Food"], answer: "Diagnosis/Solution", idealSeconds: 6 },
  { id: "G8_6", grade: "Grade 8", type: "GRAMMAR", prompt: "Identify 'Visheshan' in 'Lal phool'?", options: ["Lal", "Phool", "Hai", "None"], answer: "Lal", idealSeconds: 4 },
  { id: "G8_7", grade: "Grade 8", type: "MEANING", prompt: "Antonym of 'Vijay'?", options: ["Parajay", "Jeet", "Utsah", "Prem"], answer: "Parajay", idealSeconds: 4 },
  { id: "G8_8", grade: "Grade 8", type: "LITERARY", prompt: "Main theme of 'Jhansi ki Rani'?", options: ["Patriotism", "Nature", "Love", "Politics"], answer: "Patriotism", idealSeconds: 7 },
  { id: "G8_9", grade: "Grade 8", type: "GRAMMAR", prompt: "Meaning of 'Sandhi'?", options: ["Joining", "Separating", "Reading", "Writing"], answer: "Joining", idealSeconds: 6 },
  { id: "G8_10", grade: "Grade 8", type: "MEANING", prompt: "Meaning of 'Abhaar'?", options: ["Weight", "Gratitude", "Heavy", "Sky"], answer: "Gratitude", idealSeconds: 5 },

  // --- GRADE 9 --- (Dialects, Literary Themes, Functional Grammar)
  { id: "G9_1", grade: "Grade 9", type: "GRAMMAR", prompt: "Identify 'Samas' in 'Rajkumar'?", options: ["Tatpurush", "Digu", "Dvaidva", "Bahuvrihi"], answer: "Tatpurush", idealSeconds: 8 },
  { id: "G9_2", grade: "Grade 9", type: "MEANING", prompt: "Meaning of 'Vigrah'?", options: ["Separation/Conflict", "Assembly", "Victory", "Peace"], answer: "Separation/Conflict", idealSeconds: 7 },
  { id: "G9_3", grade: "Grade 9", type: "LITERARY", prompt: "Theme of Mahadevi Varma's 'Gillu'?", options: ["Animal Love", "War", "Science", "Industry"], answer: "Animal Love", idealSeconds: 8 },
  { id: "G9_4", grade: "Grade 9", type: "GRAMMAR", prompt: "Identify 'Kriya-Visheshan'?", options: ["Tez (Fast)", "Sher", "Ram", "Sundar"], answer: "Tez (Fast)", idealSeconds: 5 },
  { id: "G9_5", grade: "Grade 9", type: "MEANING", prompt: "Synonym of 'Kamal'?", options: ["Pankaj", "Vayu", "Ambar", "Sagar"], answer: "Pankaj", idealSeconds: 5 },
  { id: "G9_6", grade: "Grade 9", type: "LITERARY", prompt: "Author of 'Dukh ka Adhikar'?", options: ["Yashpal", "Premchand", "Pant", "Prasad"], answer: "Yashpal", idealSeconds: 9 },
  { id: "G9_7", grade: "Grade 9", type: "GRAMMAR", prompt: "Correct form of 'Prashansha'?", options: ["à¤ªà¥à¤°à¤¶à¤‚à¤¸à¤¾", "à¤ªà¥à¤°à¤¸à¤‚à¤¸à¤¾", "à¤ªà¥à¤°à¤¾à¤¶à¤‚à¤¸à¤¾", "à¤ªà¥à¤°à¤¸à¤‚à¤¶à¤¾"], answer: "à¤ªà¥à¤°à¤¶à¤‚à¤¸à¤¾", idealSeconds: 8 },
  { id: "G9_8", grade: "Grade 9", type: "MEANING", prompt: "Meaning of 'Adig'?", options: ["Unshakable", "Small", "Weak", "Quick"], answer: "Unshakable", idealSeconds: 6 },
  { id: "G9_9", grade: "Grade 9", type: "LITERARY", prompt: "Setting of 'Lhasa ki Aur'?", options: ["Tibet", "India", "Nepal", "China"], answer: "Tibet", idealSeconds: 8 },
  { id: "G9_10", grade: "Grade 9", type: "GRAMMAR", prompt: "Meaning of 'Pratyay' (Suffix)?", options: ["Front part", "Back part", "Middle", "None"], answer: "Back part", idealSeconds: 6 },

  // --- GRADE 10 --- (Board Level - Alankar, Samas, Kshitij/Kritika)
  { id: "G10_1", grade: "Grade 10", type: "GRAMMAR", prompt: "Identify 'Anupras Alankar'?", options: ["Repetition of sound", "Comparison", "Paradox", "Exaggeration"], answer: "Repetition of sound", idealSeconds: 9 },
  { id: "G10_2", grade: "Grade 10", type: "MEANING", prompt: "Meaning of 'Koti' in classical Hindi?", options: ["Crore", "Fort", "Corner", "Coat"], answer: "Crore", idealSeconds: 8 },
  { id: "G10_3", grade: "Grade 10", type: "LITERARY", prompt: "Who wrote 'Ramcharitmanas'?", options: ["Valmiki", "Tulsidas", "Kabir", "Surdas"], answer: "Tulsidas", idealSeconds: 8 },
  { id: "G10_4", grade: "Grade 10", type: "GRAMMAR", prompt: "Identify 'Rupak Alankar'?", options: ["Metaphor", "Simile", "Personification", "Puns"], answer: "Metaphor", idealSeconds: 10 },
  { id: "G10_5", grade: "Grade 10", type: "MEANING", prompt: "Synonym of 'Saraswati'?", options: ["Sharda", "Laxmi", "Durga", "Radha"], answer: "Sharda", idealSeconds: 6 },
  { id: "G10_6", grade: "Grade 10", type: "LITERARY", prompt: "Author of 'Netaji ka Chashma'?", options: ["Swayam Prakash", "Yashpal", "Pant", "Prasad"], answer: "Swayam Prakash", idealSeconds: 9 },
  { id: "G10_7", grade: "Grade 10", type: "GRAMMAR", prompt: "Meaning of 'Vachya' (Voice)?", options: ["Kartrivachya/etc", "Tense", "Case", "Gender"], answer: "Kartrivachya/etc", idealSeconds: 8 },
  { id: "G10_8", grade: "Grade 10", type: "MEANING", prompt: "Antonym of 'Stuti'?", options: ["Ninda", "Prashansha", "Prem", "Ghrina"], answer: "Ninda", idealSeconds: 7 },
  { id: "G10_9", grade: "Grade 10", type: "LITERARY", prompt: "Whose poem is 'Atmatran'?", options: ["Tagore", "Dinkar", "Nirala", "Pant"], answer: "Tagore", idealSeconds: 9 },
  { id: "G10_10", grade: "Grade 10", type: "GRAMMAR", prompt: "Type of sentence: 'If it rains, harvest will be good'?", options: ["Sanket-vachak", "Vidhan-vachak", "Agya-vachak", "Vismay-vachak"], answer: "Sanket-vachak", idealSeconds: 10 },

  // --- GRADE 11 --- (Aroh, Vitan, Senior Grammar)
  { id: "G11_1", grade: "Grade 11", type: "LITERARY", prompt: "Main sentiment (Ras) of Kabir's padas?", options: ["Shant Ras / Nirgun", "Shringar", "Raudra", "Veer"], answer: "Shant Ras / Nirgun", idealSeconds: 10 },
  { id: "G11_2", grade: "Grade 11", type: "MEANING", prompt: "Meaning of 'Bihishti' in Idgah?", options: ["Water Carrier", "Toy Vendor", "Guard", "Priest"], answer: "Water Carrier", idealSeconds: 9 },
  { id: "G11_3", grade: "Grade 11", type: "GRAMMAR", prompt: "Identify 'Sandhi' in 'Vidyalay'?", options: ["Dirgh", "Gun", "Yan", "Vriddhi"], answer: "Dirgh", idealSeconds: 8 },
  { id: "G11_4", grade: "Grade 11", type: "LITERARY", prompt: "Who is the 'Poet of Nature' (Prakritik Sukumar Kavi)?", options: ["Pant", "Nirala", "Prasad", "Mahadevi"], answer: "Pant", idealSeconds: 9 },
  { id: "G11_5", grade: "Grade 11", type: "MEANING", prompt: "Meaning of 'Swaatantraya'?", options: ["Independence", "Slavery", "Brotherhood", "Justice"], answer: "Independence", idealSeconds: 7 },
  { id: "G11_6", grade: "Grade 11", type: "GRAMMAR", prompt: "Identify 'Sanyukt Kriya'?", options: ["Chal-dena", "Kha-lena", "Bolna", "Both first two"], answer: "Both first two", idealSeconds: 8 },
  { id: "G11_7", grade: "Grade 11", type: "LITERARY", prompt: "Author of 'Namak ka Daroga'?", options: ["Premchand", "Yashpal", "Pant", "Prasad"], answer: "Premchand", idealSeconds: 9 },
  { id: "G11_8", grade: "Grade 11", type: "MEANING", prompt: "Synonym of 'Abhishap'?", options: ["Var-daan", "Shaap", "Prem", "Ghrina"], answer: "Shaap", idealSeconds: 6 },
  { id: "G11_9", grade: "Grade 11", type: "LITERARY", prompt: "Movement of 'Nirala'?", options: ["Chayavad", "Pragativad", "Ritikaal", "Aadikaal"], answer: "Chayavad", idealSeconds: 9 },
  { id: "G11_10", grade: "Grade 11", type: "GRAMMAR", prompt: "Meaning of 'Abhidha' in shabd-shakti?", options: ["Literal meaning", "Hidden meaning", "Sarcasm", "None"], answer: "Literal meaning", idealSeconds: 10 },

  // --- GRADE 12 --- (Aroh, Vitan, Advanced Literary Analysis)
  { id: "G12_1", grade: "Grade 12", type: "LITERARY", prompt: "Movement of Jaishankar Prasad?", options: ["Chayavad", "Pragativad", "Prayogvad", "Ritikal"], answer: "Chayavad", idealSeconds: 9 },
  { id: "G12_2", grade: "Grade 12", type: "GRAMMAR", prompt: "Figure of speech in 'Sheetal Vani mein Aag'?", options: ["Virodhabhas", "Upama", "Rupak", "Yamak"], answer: "Virodhabhas", idealSeconds: 10 },
  { id: "G12_3", grade: "Grade 12", type: "LITERARY", prompt: "Who is known as the 'Psychological Novelist'?", options: ["Jainendra Kumar", "Premchand", "Yashpal", "Agyeya"], answer: "Jainendra Kumar", idealSeconds: 11 },
  { id: "G12_4", grade: "Grade 12", type: "MEANING", prompt: "Meaning of 'Vinay' in Bhaktikaal context?", options: ["Humility/Request", "Pride", "Fear", "War"], answer: "Humility/Request", idealSeconds: 8 },
  { id: "G12_5", grade: "Grade 12", type: "GRAMMAR", prompt: "Identify 'Samas' in 'Dashanan'?", options: ["Bahuvrihi", "Digu", "Tatpurush", "Avyayibhav"], answer: "Bahuvrihi", idealSeconds: 10 },
  { id: "G12_6", grade: "Grade 12", type: "LITERARY", prompt: "Central character of 'Silver Wedding'?", options: ["Yashodhar Pant", "Kishan da", "Bhushan", "Chaddha"], answer: "Yashodhar Pant", idealSeconds: 10 },
  { id: "G12_7", grade: "Grade 12", type: "MEANING", prompt: "Meaning of 'Sarvahara' in Marxist Hindi literature?", options: ["Proletariat / Lower Class", "Bourgeoisie", "God", "King"], answer: "Proletariat / Lower Class", idealSeconds: 12 },
  { id: "G12_8", grade: "Grade 12", type: "LITERARY", prompt: "Style of Harivansh Rai Bachchan's 'Atmaparichay'?", options: ["Halavad", "Chayavad", "Rahasyavad", "Prayogvad"], answer: "Halavad", idealSeconds: 11 },
  { id: "G12_9", grade: "Grade 12", type: "GRAMMAR", prompt: "Identify the Sanchari Bhav count in Rasa?", options: ["33", "8", "11", "9"], answer: "33", idealSeconds: 10 },
  { id: "G12_10", grade: "Grade 12", type: "MEANING", prompt: "Meaning of 'Pratibha' in poetry?", options: ["Creative Genius", "Copying", "Reading", "Writing"], answer: "Creative Genius", idealSeconds: 9 }
];
