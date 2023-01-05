import { createSlice } from "@reduxjs/toolkit";
import { parseFromGoogle } from "../../util/parseSavedData";


const quizzesSlice = createSlice({
    name: 'quizzes',
    initialState: {
        quizzes: {}
    },
    reducers: {
        parseQuizzesFromGoogle: (state, action) => {
            const parsedData = parseFromGoogle(action.payload.body.content);
            state.quizzes = parsedData.quizzes;
        },

        addQuiz: (state, action) => {
            const { id, name, topicId, image, cards} = action.payload;
            state.quizzes[id] = {
                id: id,
                name: name,
                topicId: topicId,
                image: image,
                cards: cards
            }
        },

        removeQuiz: (state, action) => {
            state.quizzes = {};

            for (let quiz of action.payload) {
                state.quizzes[quiz.id] = quiz;
            }
        }
    }
});

export const { parseQuizzesFromGoogle, addQuiz, removeQuiz } = quizzesSlice.actions;
export const selectQuizzes = (state) => state.quizzes.quizzes;

export default quizzesSlice.reducer;