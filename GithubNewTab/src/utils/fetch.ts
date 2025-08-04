export class FetchUtil {
    // Function to get the github user information

    async fetchGithubUserInfo(username: string) {
        try {
            const response = await fetch(`https://api.github.com/users/${username}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', error);
        }
    }
}