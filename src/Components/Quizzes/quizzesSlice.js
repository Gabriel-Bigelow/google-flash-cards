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
            console.log(parsedData);
            //state.quizzes = parsedData.quizzes;
            state.quizzes = parsedData.quizzes;

            console.log(parsedData.quizzes);
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
        }
    }
});

export const { parseQuizzesFromGoogle, addQuiz } = quizzesSlice.actions;
export const selectQuizzes = (state) => state.quizzes.quizzes;

export default quizzesSlice.reducer;