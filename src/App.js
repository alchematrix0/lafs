import React, { Component } from 'react';
import './App.css';
import { Columns, Hero, Card, Media, Content, Section, Navbar, Heading, Breadcrumb, Tag, Label, Form, Button, Container } from 'react-bulma-components/full';
const data = require("./data.json");
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      keywords: [],
      category: [],
      commodity: [],
      searchInput: '',
      categories: [],
      subcategories: [],
      commodities: [],
      resources: []
    }
  }
  applyFilters = (resources) => resources.filter(resource => {
    if (this.state.searchInput.length && !resource.terms.some(t => t.includes(this.state.searchInput.toLowerCase()))) {
      return false
    }
    let cats = [resource.category, resource.subcategory]
    let {category, commodity} = this.state
    return (
      // if no category or commodity selected return true for all resources that have passed search input filter
      (!category.length && !commodity.length) ||
      // or, if we have checkbox selections
        // first option: we have a category and a commodity, they must both match to return true
      (category.length && commodity.length && category.every(c => cats.includes(c)) && commodity.every(c => resource.commodity === c)) ||
        // second option: we have no category and a commodity
      (!category.length && commodity.length && commodity.every(c => resource.commodity === c)) ||
        // third option: we have no commodity and a category
      (!commodity.length && category.length && category.every(c => cats.includes(c)))
      // (this.state.searchInput.length && resource.keys.split(',').map(t => t.trim()).some(k => k.toLowerCase().includes(this.state.searchInput)))
    )
  })
  handleSearchInput = (e) => {
    this.setState({searchInput: e.target.value})
  }
  toggleCategory = (e) => this.setState({ category: e.target.checked ? this.state.category.concat([e.target.name]) : this.state.category.filter(v => v !== e.target.name) })
  toggleCommodity = (e) => this.setState({ commodity: e.target.checked ? this.state.commodity.concat([e.target.name]) : this.state.commodity.filter(v => v !== e.target.name) })
  componentWillMount () {
    let db = data.map(d => Object.assign({}, d, {
      terms: d.keys.split(',').concat([d.organization, d.category, d.web_link, d.subcategory]).map(t => t.trim().toLowerCase()),
      category: d.category.toLowerCase().trim(),
      subcategory: d.subcategory.toLowerCase().trim(),
      commodity: d.commodity.toLowerCase().trim()
    }))
    this.setState({
      categories: Array.from(new Set(data.map(resource => resource.category.toLowerCase().trim()).concat(data.map(resource => resource.subcategory.toLowerCase().trim())))),
      commodities: Array.from(new Set(data.map(resource => resource.commodity.toLowerCase().trim()))),
      resources: db
    })
  }

  renderResources = () => {
    return this.state.category.length > 2 || this.state.commodity.length > 1 ? <h3>No matches possible, relax your sphincter!</h3> :
    this.applyFilters(this.state.resources).map(resource => {
      let breadcrumbs = resource.category !== resource.subcategory ? [{name: resource.category, url: 'some-link', key : 1}, {name: resource.subcategory, url: '', key : 2}] : [{name: resource.category, url: 'some-link', key : 1}]
      return (
        <Columns.Column size={6} key={resource.web_link}>
          <Card>
            <Card.Image size="4by3" src={resource.img} />
            <Card.Content>
              <Media>
                <Media.Item>
                  <Heading style={{color: 'black', textTransform: 'capitalize'}} size={4}>
                    <a href={resource.web_link} target='_blank'>{resource.resource}</a>
                  </Heading>
                  <Heading subtitle style={{color: 'black', textTransform: 'capitalize'}} size={6}>
                    {resource.organization}
                  </Heading>
                </Media.Item>
              </Media>
              <Breadcrumb style={{marginBottom: '-1em', textTransform: 'capitalize'}} items={breadcrumbs} />
              <Content>
                <br />
                {resource.keys.split(',').map((t, i) => {let tag = t.trim(); return (
                  <Tag key={`${i}${Math.random()}`}>
                    {tag}
                  </Tag>
                )})}
                <br/>
              </Content>
            </Card.Content>
          </Card>
        </Columns.Column>
      )
    })
  }
  render() {
    return (
      <Hero color="info" size="fullheight">
        <Hero.Head renderAs="header">
          <Navbar fixed='top' color='white'>
            <Navbar.Brand>
              <Navbar.Item href="#" renderAs='header'>
                Farmer Resource Database
              </Navbar.Item>
            </Navbar.Brand>
          </Navbar>
        </Hero.Head>
        <Hero.Body>
          <Container>
            <Columns>
              <Columns.Column size={8}>
                <Columns>
                  {this.renderResources()}
                </Columns>
              </Columns.Column>
              <Columns.Column className='filters' style={{marginTop: '0.5em', position: 'fixed', right: '2em', maxWidth: '100%'}} size={4}>
                <Form.Control style={{marginBottom: '1em'}}>
                  <Form.Input placeholder="search anything" value={this.state.searchInput} onChange={this.handleSearchInput}></Form.Input>
                </Form.Control>
                <Form.Control style={{marginBottom: '0.5em'}}><Heading>Category</Heading></Form.Control>
                {this.state.categories.map((c, i) => (
                  <Form.Control fullwidth size='medium' key={i} style={{textTransform: 'capitalize'}}>
                    <Form.Checkbox name={c} onClick={this.toggleCategory}>{c}</Form.Checkbox>
                  </Form.Control>))}
                <hr />
                <Form.Control style={{marginBottom: '0.5em'}}><Heading>Commodity</Heading></Form.Control>
                {this.state.commodities.map((c, i) => (
                  <Form.Control fullwidth size='medium' key={i} style={{textTransform: 'capitalize'}}>
                    <Form.Checkbox name={c} onClick={this.toggleCommodity}>{c}</Form.Checkbox>
                  </Form.Control>))}
              </Columns.Column>
            </Columns>
          </Container>
        </Hero.Body>
      </Hero>
    );
  }
}

export default App;
