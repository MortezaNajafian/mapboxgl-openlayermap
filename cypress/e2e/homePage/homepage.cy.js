describe("HOME PAGE", () => {

    const getParamValue = (paramName, str) => {
        const pattern = `(${paramName}=([0-9.-]+))`
        return +str.match(new RegExp(pattern, 'g')).join('').split('=')[1]
    }

    before(() => {
        cy.visit('http://localhost:3000')
    })

    it("should render root element", () => {
        cy.get('#root').should('be.visible')
    })

    it("should render Mapbox Map container", () => {
        cy.get('[data-test="mapbox-container"]').should('be.visible')
    })


    it("should render OpenLayer Map container", () => {
        cy.get('[data-test="open-layer-container"]').should('be.visible')
    })

    it("location should be has some factors", () => {
        cy.location().should((loc) => {
            expect(loc.host).to.eq('localhost:3000')
            expect(loc.hostname).to.eq('localhost')
            expect(loc.origin).to.eq('http://localhost:3000')
            expect(loc.port).to.eq('3000')
            expect(loc.protocol).to.eq('http:')
            expect(loc.search).to.eq('?zoom=4&lng=20.56934502726&lat=-22.35&rotate=0')
            expect(loc.toString()).to.eq(
                'http://localhost:3000/?zoom=4&lng=20.56934502726&lat=-22.35&rotate=0'
            )
        })
    })

    it("should set and change data after reload", () => {
        cy.window().then((window) => {
            window.history.replaceState(null, "", `?zoom=${6}&lng=${22}&lat=${-25}&rotate=${90}`)
        }).then(() => {
            cy.reload().then(() => {
                cy.location().should((loc) => {
                    const rotate = getParamValue('rotate', loc.search)
                    const lng = getParamValue('lng', loc.search)
                    const lat = getParamValue('lat', loc.search)
                    const zoom = getParamValue('zoom', loc.search)
                    expect(rotate).to.equal(90)
                    expect(lng).to.equal(22)
                    expect(lat).to.equal(-25)
                    expect(zoom).to.equal(6)
                })
            })
        })
    })

    it('should change zoom from mapbox gl map', () => {
        cy.get('[data-test="mapbox-container"]').should('exist').within(() => {
            cy.location().then((loc) => {
                cy.wrap(loc.search).as("glBeforeZoomOutSearchParams")
            }).then(function () {
                const beforeZoomOutSearchParams = this.glBeforeZoomOutSearchParams;
                const zoomBefore = getParamValue('zoom', beforeZoomOutSearchParams)
                cy.get('button.mapboxgl-ctrl-zoom-out').click().wait(1000).then(() => {
                    cy.location().then((loc) => {
                        const zoomAfter = getParamValue('zoom', loc.search)
                        expect(zoomAfter).to.be.lt(zoomBefore)
                    })
                })
            }).then(() => {
                cy.location().then((loc) => {
                    cy.wrap(loc.search).as("glBeforeZoomInSearchParams")
                }).then(function () {
                    const beforeZoomInSearchParams = this.glBeforeZoomInSearchParams;
                    const zoomBefore = getParamValue('zoom', beforeZoomInSearchParams)
                    cy.get('button.mapboxgl-ctrl-zoom-in').click().wait(1000).then(() => {
                        cy.location().then((loc) => {
                            const zoomAfter = getParamValue('zoom', loc.search)
                            expect(zoomAfter).to.be.gt(zoomBefore)
                        })
                    })
                })
            })
        })

    })


    it("should change zoom from open layer map ", () => {
        cy.get('[data-test="open-layer-container"]').should('exist').within(() => {
            cy.location().then((loc) => {
                cy.wrap(loc.search).as("olBeforeZoomOutSearchParams")
            }).then(function () {
                const beforeZoomOutSearchParams = this.olBeforeZoomOutSearchParams;
                const zoomBefore = getParamValue('zoom', beforeZoomOutSearchParams)
                cy.get('button.ol-zoom-out').click().wait(1000).then(() => {
                    cy.location().then((loc) => {
                        const zoomAfter = getParamValue('zoom', loc.search)
                        expect(zoomAfter).to.be.lt(zoomBefore)
                    })
                })
            }).then(() => {
                cy.location().then((loc) => {
                    cy.wrap(loc.search).as("olBeforeZoomInSearchParams")
                }).then(function () {
                    const beforeZoomInSearchParams = this.olBeforeZoomInSearchParams;
                    const zoomBefore = getParamValue('zoom', beforeZoomInSearchParams)
                    cy.get('button.ol-zoom-in').click().wait(1000).then(() => {
                        cy.location().then((loc) => {
                            const zoomAfter = getParamValue('zoom', loc.search)
                            expect(zoomAfter).to.be.gt(zoomBefore)
                        })
                    })
                })
            })
        })
    })


})