import DefaultLearnerAvatar from "../img/default_learner_avatar.png"
import DefaultGirlAvatar from "../img/default_girl_avatar.jpg";

export const get_learner_avatar = (gender: "boy" | "girl" | null) => {
    return gender === "boy" ? DefaultLearnerAvatar : gender === "girl" ? DefaultGirlAvatar : DefaultLearnerAvatar
}