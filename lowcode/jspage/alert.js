import { init } from "../glitterBundle/GVController.js";
init(import.meta.url, (gvc, glitter, gBundle) => {
    return {
        onCreateView: () => {
            return `
            <div class="d-flex flex-column align-items-center justify-content-center vh-100 vw-100" >
           <div class="alert alert-danger">${gBundle}</div>
</div>
            `;
        }
    };
});
