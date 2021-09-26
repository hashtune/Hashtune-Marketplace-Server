import server from "../server";

describe('Test artwork mutations', () => {
    const ADD_ARTWORK_MUTATION = `
        mutation AddArtwork($addArtworkInputType: CreateArtworkInput) {
            addArtwork(InputType: $addArtworkInputType) {
                title
                description
                saleType
                creator {
                    fullName
                }
            }
        }
    `

    const DELETE_ARTWORK_MUTATION = `
        mutation DeleteArtworkMutation($deleteArtworkId: String!) {
            deleteArtwork(id: $deleteArtworkId) {
                title
                description
                listed
            }
        }
        `

    const exampleArgs = {
        id: "cku19uv5a0003yy0w7vfmiv9j",
        handle: "something",
        title: "strstrstr",
        image: "Sun",
        description: "Art",
        link: "a.rt/",
        media: { "data": [{ "media": "lala", "title": "amazingsongTitle" }] },
        currentOwner: "cku10kd240000sm0wostud3r8",
        creator: "cku10kd240000sm0wostud3r8"
    }

    it("should create an artwork", async () => {
        const res = await server.executeOperation({
            query: ADD_ARTWORK_MUTATION,
            variables: {
                addArtworkInputType: {
                    ...exampleArgs, saleType: "auction", reservePrice: 50
                }
            }
        })
        expect(res).toMatchSnapshot();
    });

    it("should fail to create an artwork", async () => {
        const res = await server.executeOperation({
            query: ADD_ARTWORK_MUTATION,
            variables: {
                addArtworkInputType: {
                    ...exampleArgs, saleType: "fixed", reservePrice: 50
                }
            }
        })
        expect(res).toMatchSnapshot();
    });

    it("should delete an artork", async () => {
        const res = await server.executeOperation({
            query: DELETE_ARTWORK_MUTATION,
            variables: {
                deleteArtworkId: "cku19uv5a0003yy0w7vfmiv9j"
            }
        })
        expect(res).toMatchSnapshot();
    })

})

export { };
