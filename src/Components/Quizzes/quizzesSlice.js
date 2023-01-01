import { createSlice } from "@reduxjs/toolkit";


const quizzesSlice = createSlice({
    name: 'quizzes',
    initialState: {
        quizzes: {}
    },
    reducers: {
        addQuiz: (state, action) => {
            console.log(action.payload);
            const { id, name, topicId, cards} = action.payload;
            state.quizzes[id] = {
                id: id,
                name: name,
                topicId: topicId,
                cards: cards
            }
        }
    }
});

export const { addQuiz } = quizzesSlice.actions;
export const selectQuizzes = (state) => state.quizzes.quizzes;

export default quizzesSlice.reducer;