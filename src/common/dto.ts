export interface AbstractDTO {
    dateModified: string;
    dateCreated: string;
    modifiedBy: string;
    createdBy: string;
}

export interface UserDTO {
    id?: string;
    username: string;
    password: string;
    email: string;
    status: string;
    preference: string;
}

export interface UserInfoDTO {
    id?: string;
    username: string;
    email: string;
    preference: string;
    height: number;
    weight: number;
    point: number;
    gender: string;
}

export interface MaterialListItemDTO {
    id?: string;
    name: string;
    shorDescription: string;
    type: string;
    url: string;
    content: string;
}
export interface MaterialItemDTO {
    id?: string;
    name: string;
    shorDescription: string;
    type: string;
    url: string;
    content: string;
}

export interface UserSearchResultDTO {
    id?: string;
    username: string;
}

export interface FriendDTO {
    id?: string;
    username: string;
    email: string;
}

export interface QuestionDTO {
    id?: string;
    question: string;
    answerOptions: string[];
}

export interface QuestionResultDTO {
    id?: string;
    question: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
    points: number;
}

export interface QuizHistoryListItemDTO {
    id?: string;
    question: string;
    date: string;
    isCorrect: boolean;
    points: number;
}

export interface RankDTO {
    id?: string;
    rank: number;
    point: number;
}

export interface BMIDTO {
    bmi: number;
    bmiCategory: string;
    bmiRanking: number;
}

export interface StressDTO {
    id?: string;
    stressLevel: number;
    date: string;
}

export interface StressTrendDTO {
    id: string;
    trend: string;
    mean: number;
    mode: number;
}

export interface SleepDTO {
    sleepDuration: string;
    sleepEfficiency: number;
    startTime: string;
    endTime: string;
}